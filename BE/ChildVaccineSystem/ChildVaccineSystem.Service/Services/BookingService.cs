using AutoMapper;
using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;

namespace ChildVaccineSystem.Service.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVaccineInventoryService _inventoryService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationService> _logger;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, IVaccineInventoryService inventoryService, IServiceProvider serviceProvider, ILogger<NotificationService>? logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _inventoryService = inventoryService;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task<BookingDTO> GetByIdAsync(int id)
        {
            var booking = await _unitOfWork.Bookings.GetAsync(
                b => b.BookingId == id,
                includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User"
            );

            if (booking == null)
                throw new ArgumentException($"Đặt chỗ bằng ID {id} không tìm thấy");

            var bookingDTO = _mapper.Map<BookingDTO>(booking);

            // ✅ Ánh xạ tên Vaccine và tên Combo Vaccine + Đánh dấu trạng thái của từng mũi
            foreach (var detail in bookingDTO.BookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    // 👉 Vaccine lẻ
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId.Value);
                    detail.VaccineName = vaccine?.Name;
                    detail.Status = "Không áp dụng";
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    // 👉 Combo Vaccine
                    var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detail.ComboVaccineId.Value);
                    detail.ComboVaccineName = comboVaccine?.ComboName;

                    // ✅ Kiểm tra trạng thái hoàn thành của mũi
                    var bookingDetail = await _unitOfWork.BookingDetails.GetAsync(bd => bd.BookingDetailId == detail.VaccineId);

                    detail.Status = bookingDetail.Status == BookingDetailStatus.Completed
                        ? "Đã hoàn thành"
                        : "Chưa hoàn thành";
                }
            }

            // ✅ Kiểm tra nếu Children được Include đúng
            if (booking.Children != null)
            {
                bookingDTO.ChildName = booking.Children.FullName ?? "Không xác định";
            }
            else
            {
                bookingDTO.ChildName = "Không xác định";
            }

            return bookingDTO;
        }


        public async Task<List<string>> CheckParentVaccinesInBookingAsync(List<int> VaccineIds)
        {
            var warningMessages = new Dictionary<int, (string ParentName, List<string> ChildrenNames)>();

            foreach (var vaccineId in VaccineIds)
            {
                var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == vaccineId);

                if (vaccine?.IsParentId != null)
                {
                    var parentVaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == vaccine.IsParentId.Value);

                    if (parentVaccine != null)
                    {
                        if (!warningMessages.ContainsKey(parentVaccine.VaccineId))
                        {
                            warningMessages[parentVaccine.VaccineId] = (parentVaccine.Name, new List<string>());
                        }

                        warningMessages[parentVaccine.VaccineId].ChildrenNames.Add(vaccine.Name);
                    }
                }
            }

            return warningMessages.Select(kv =>
                    $"Tiêm vaccine {kv.Value.ParentName} trước khi tiêm {string.Join(", ", kv.Value.ChildrenNames)}. Bạn đã tiêm vaccine {kv.Value.ParentName} cho trẻ chưa?")
                .ToList();
        }


        public async Task<BookingDTO> CreateAsync(string userId, CreateBookingDTO bookingDto)
        {
            // ✅ Kiểm tra dữ liệu đầu vào
            await ValidateBooking(userId, bookingDto);

            // ✅ Ánh xạ từ DTO sang entity Booking
            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;

            // ✅ Tự động lấy ngày tiêm đầu tiên làm ngày đặt lịch nếu không được truyền vào
            if (bookingDto.BookingDate == default)
            {
                booking.BookingDate = DateTime.UtcNow.Date;
            }
            else
            {
                booking.BookingDate = bookingDto.BookingDate;
            }

            // ✅ Xác định loại đặt lịch ở cấp `Booking`
            if (bookingDto.BookingDetails.Any(bd => bd.ComboVaccineId.HasValue))
            {
                booking.BookingType = BookingType.comboVacinne;
            }
            else
            {
                booking.BookingType = BookingType.singleVaccine;
            }

            booking.BookingDetails = new List<BookingDetail>();
            decimal totalPrice = 0;

            // ✅ Kiểm tra nếu đứa trẻ thuộc về người dùng hiện tại
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
            if (child == null || child.UserId != userId)
            {
                throw new ArgumentException("Đứa trẻ này không thuộc về người dùng hiện tại.");
            }

            // ✅ Xác định chính sách giá (nếu có)
            var pricingPolicy = await GetPricingPolicyForBookingAsync(booking.BookingDate);
            if (pricingPolicy != null)
            {
                booking.PricingPolicyId = pricingPolicy.PricingPolicyId;
            }

            // ✅ Xử lý chi tiết các mũi tiêm
            foreach (var detailDto in bookingDto.BookingDetails)
            {
                if (detailDto.ComboVaccineId.HasValue)
                {
                    // 🔥 Xử lý combo vaccine
                    var comboVaccine = await _unitOfWork.ComboVaccines
                        .GetAsync(cv => cv.ComboId == detailDto.ComboVaccineId);

                    if (comboVaccine == null)
                    {
                        throw new ArgumentException($"Không tìm thấy vắc xin kết hợp với ID {detailDto.ComboVaccineId}");
                    }

                    // 🔥 Lấy danh sách các mũi tiêm từ combo
                    var comboDetails = await _unitOfWork.ComboDetails
                        .GetAllAsync(cd => cd.ComboId == detailDto.ComboVaccineId);

                    if (!comboDetails.Any())
                    {
                        throw new ArgumentException($"Không có dữ liệu chi tiết cho combo ID {detailDto.ComboVaccineId}");
                    }

                    DateTime nextInjectionDate = detailDto.InjectionDate;

                    foreach (var comboDetail in comboDetails.OrderBy(cd => cd.Order))
                    {
                        var vaccine = await _unitOfWork.Vaccines
                            .GetAsync(v => v.VaccineId == comboDetail.VaccineId);

                        if (vaccine == null)
                        {
                            throw new ArgumentException($"Không tìm thấy vaccine ID {comboDetail.VaccineId}");
                        }

                        var vaccineInventory = await _unitOfWork.VaccineInventories
                            .GetAsync(vi => vi.VaccineId == comboDetail.VaccineId);

                        if (vaccineInventory == null)
                        {
                            throw new ArgumentException($"Không tìm thấy hàng tồn kho cho VaccineId {comboDetail.VaccineId}");
                        }

                        // ✅ Kiểm tra số lần tiêm vaccine lẻ đã chích trước đó
                        var completedInjectionCount = await _unitOfWork.BookingDetails
                            .CountAsync(bd => bd.Booking.ChildId == bookingDto.ChildId &&
                                              bd.VaccineId == vaccine.VaccineId &&
                                              bd.Status != BookingDetailStatus.Cancelled);

                        if (completedInjectionCount >= vaccine.InjectionsCount)
                        {
                            throw new ArgumentException($"Trẻ này đã hoàn thành đủ {vaccine.InjectionsCount} mũi cho vaccine {vaccine.Name}.");
                        }

                        var bookingDetail = new BookingDetail
                        {
                            Booking = booking,
                            ComboVaccineId = detailDto.ComboVaccineId,
                            VaccineId = vaccine.VaccineId,
                            Price = vaccine.Price,
                            VaccineInventoryId = vaccineInventory.VaccineInventoryId,
                            BookingDate = booking.BookingDate,
                            InjectionDate = nextInjectionDate,
                            Status = BookingDetailStatus.Pending,
                            BookingType = BookingType.comboVacinne
                        };

                        booking.BookingDetails.Add(bookingDetail);

                        // ✅ Tính ngày tiêm kế tiếp theo khoảng cách intervalDays
                        nextInjectionDate = nextInjectionDate.AddDays(comboDetail.IntervalDays);
                    }

                    // ✅ Chỉ cộng 1 lần giá tổng combo
                    totalPrice += comboVaccine.TotalPrice;
                }
                else if (detailDto.VaccineId.HasValue)
                {
                    // 🔥 Xử lý vaccine lẻ
                    var vaccine = await _unitOfWork.Vaccines
                        .GetAsync(v => v.VaccineId == detailDto.VaccineId);

                    if (vaccine == null)
                    {
                        throw new ArgumentException($"Không tìm thấy vaccine ID {detailDto.VaccineId}");
                    }

                    var vaccineInventory = await _unitOfWork.VaccineInventories
                        .GetAsync(vi => vi.VaccineId == vaccine.VaccineId);

                    if (vaccineInventory == null)
                    {
                        throw new ArgumentException($"Không tìm thấy hàng tồn kho cho VaccineId {vaccine.VaccineId}");
                    }

                    // ✅ Kiểm tra số lần tiêm vaccine lẻ
                    var completedInjectionCount = await _unitOfWork.BookingDetails
                        .CountAsync(bd => bd.Booking.ChildId == bookingDto.ChildId &&
                                          bd.VaccineId == vaccine.VaccineId &&
                                          bd.Status != BookingDetailStatus.Cancelled);

                    if (completedInjectionCount >= vaccine.InjectionsCount)
                    {
                        throw new ArgumentException($"Trẻ này đã hoàn thành đủ {vaccine.InjectionsCount} mũi cho vaccine {vaccine.Name}.");
                    }

                    var bookingDetail = new BookingDetail
                    {
                        Booking = booking,
                        VaccineId = vaccine.VaccineId,
                        Price = vaccine.Price,
                        VaccineInventoryId = vaccineInventory.VaccineInventoryId,
                        BookingDate = booking.BookingDate,
                        InjectionDate = detailDto.InjectionDate,
                        Status = BookingDetailStatus.Pending,
                        BookingType = BookingType.singleVaccine
                    };

                    booking.BookingDetails.Add(bookingDetail);
                    totalPrice += vaccine.Price;
                }
            }

            // ✅ Cập nhật tổng giá trị booking
            booking.TotalPrice = totalPrice;

            // ✅ Lưu vào cơ sở dữ liệu
            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();

            // ✅ Trả về DTO
            return await GetByIdAsync(booking.BookingId);
        }




        private async Task<PricingPolicy> GetPricingPolicyForBookingAsync(DateTime bookingDate)
        {
            // Calculate the difference in days between the current date and the booking date
            var daysDifference = (bookingDate - DateTime.Now).Days;

            // Fetch all pricing policies and find the one that matches the time range
            var pricingPolicies = await _unitOfWork.PricingPolicies.GetAllAsync();

            var validPricingPolicy = pricingPolicies.FirstOrDefault(pp =>
                pp.WaitTimeRangeStart <= daysDifference && pp.WaitTimeRangeEnd >= daysDifference);

            // Return the valid pricing policy, or null if not found
            return validPricingPolicy;
        }


        public async Task<List<BookingDTO>> GetUserBookingsAsync(string userId)
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync(
                b => b.UserId == userId,
                includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User"
            );

            var result = _mapper.Map<List<BookingDTO>>(bookings);

            foreach (var booking in result)
            {
                foreach (var detail in booking.BookingDetails)
                {
                    if (detail.VaccineId.HasValue)
                    {
                        var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId.Value);
                        detail.VaccineName = vaccine?.Name;
                    }
                    else if (detail.ComboVaccineId.HasValue)
                    {
                        var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detail.ComboVaccineId.Value);
                        detail.ComboVaccineName = comboVaccine?.ComboName;
                    }
                }
            }
            foreach (var booking in result)
            {
                // ✅ Kiểm tra nếu Children được Include đúng
                if (booking.ChildId != null)
                {
                    var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == booking.ChildId);
                    booking.ChildName = child?.FullName ?? "Không xác định";
                }
            }

            return result;
        }


        private async Task ValidateBooking(string userId, CreateBookingDTO bookingDto)
        {
            // ✅ Gán BookingDate nếu không truyền vào
            if (bookingDto.BookingDate == default(DateTime))
            {
                bookingDto.BookingDate = bookingDto.BookingDetails.Min(bd => bd.InjectionDate.Date);
            }

            if (bookingDto.BookingDate < DateTime.Now.Date)
            {
                throw new ArgumentException("Ngày đặt lịch không thể là ngày trong quá khứ.");
            }

            // ✅ Kiểm tra trùng lịch cùng ngày
            var existingBooking = await _unitOfWork.Bookings.GetAsync(
                b => b.UserId == userId &&
                     b.BookingDate.Date == bookingDto.BookingDate.Date &&
                     b.ChildId == bookingDto.ChildId
            );

            if (existingBooking != null)
            {
                throw new ArgumentException("Trẻ này đã có lịch tiêm trong cùng ngày.");
            }

            // ✅ Kiểm tra quyền sở hữu trẻ
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
            if (child == null || child.UserId != userId)
            {
                throw new ArgumentException("Không tìm thấy đứa trẻ hoặc đứa trẻ không thuộc về người dùng.");
            }

            // ✅ Danh sách chi tiết không được rỗng
            if (bookingDto.BookingDetails == null || !bookingDto.BookingDetails.Any())
            {
                throw new ArgumentException("Phải có ít nhất một loại vaccine hoặc vaccine combo trong lịch tiêm.");
            }

            // ✅ Không mix vaccine lẻ và combo
            bool hasVaccine = bookingDto.BookingDetails.Any(bd => bd.VaccineId.HasValue);
            bool hasComboVaccine = bookingDto.BookingDetails.Any(bd => bd.ComboVaccineId.HasValue);

            if (hasVaccine && hasComboVaccine)
                throw new ArgumentException("Không thể kết hợp vaccine lẻ và vaccine combo trong cùng một lần đặt lịch.");

            if (!hasVaccine && !hasComboVaccine)
                throw new ArgumentException("Việc đặt chỗ phải nêu rõ vaccine hoặc vaccine combo.");

            // ✅ Validate từng mũi tiêm
            foreach (var detail in bookingDto.BookingDetails)
            {
                if (detail.InjectionDate.Date < bookingDto.BookingDate.Date)
                {
                    throw new ArgumentException(
                        $"Ngày tiêm {detail.InjectionDate:dd/MM/yyyy} không thể nhỏ hơn ngày đặt lịch {bookingDto.BookingDate:dd/MM/yyyy}."
                    );
                }

                if (detail.InjectionDate.Date < DateTime.Now.Date)
                {
                    throw new ArgumentException(
                        $"Ngày tiêm cho vaccine ID {detail.VaccineId ?? detail.ComboVaccineId} không thể là ngày trước ngày hiện tại."
                    );
                }

                if (detail.VaccineId.HasValue)
                {
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId);
                    if (vaccine == null)
                        throw new ArgumentException($"Không tìm thấy vaccine với ID {detail.VaccineId}");

                    var vaccineInventory = await _unitOfWork.VaccineInventories.GetAsync(vi => vi.VaccineId == detail.VaccineId);
                    if (vaccineInventory == null)
                        throw new ArgumentException($"Không tìm thấy hàng tồn kho cho vaccine ID {detail.VaccineId}");

                    var injectionSchedules = (await _unitOfWork.InjectionSchedules.GetAllAsync(
                        isd => isd.VaccineScheduleDetail.VaccineId == detail.VaccineId)).OrderBy(i => i.InjectionNumber).ToList();

                    if (injectionSchedules.Any())
                    {
                        var maxInjectionNumber = injectionSchedules.Max(i => i.InjectionNumber);

                        var completedInjectionCount = await _unitOfWork.BookingDetails
                            .CountAsync(bd => bd.Booking.ChildId == bookingDto.ChildId &&
                                              bd.VaccineId == detail.VaccineId &&
                                              bd.Status != BookingDetailStatus.Cancelled);

                        if (completedInjectionCount >= maxInjectionNumber)
                        {
                            throw new ArgumentException($"Trẻ này đã hoàn thành đủ {maxInjectionNumber} mũi cho vaccine {vaccine.Name}.");
                        }

                        var lastInjection = await _unitOfWork.BookingDetails
                            .GetAllAsync(bd => bd.Booking.ChildId == bookingDto.ChildId &&
                                               bd.VaccineId == detail.VaccineId &&
                                               bd.Status != BookingDetailStatus.Cancelled);

                        var lastInjectionDate = lastInjection.OrderByDescending(bd => bd.InjectionDate).FirstOrDefault();

                        if (lastInjectionDate != null)
                        {
                            var nextInjectionNumber = completedInjectionCount + 1;
                            var currentSchedule = injectionSchedules.FirstOrDefault(i => i.InjectionNumber == nextInjectionNumber);

                            if (currentSchedule != null)
                            {
                                var intervalDays = currentSchedule.InjectionMonth * 30;
                                if ((detail.InjectionDate - lastInjectionDate.InjectionDate).Days < intervalDays)
                                {
                                    throw new ArgumentException($"Mũi thứ {nextInjectionNumber} của vaccine {vaccine.Name} cần cách mũi trước tối thiểu {intervalDays / 30} tháng.");
                                }
                            }
                        }

                        var sameVaccineInRequest = bookingDto.BookingDetails
                            .Where(bd => bd.VaccineId == detail.VaccineId)
                            .OrderBy(bd => bd.InjectionDate)
                            .ToList();

                        for (int i = 1; i < sameVaccineInRequest.Count; i++)
                        {
                            var prev = sameVaccineInRequest[i - 1];
                            var curr = sameVaccineInRequest[i];
                            var prevSchedule = injectionSchedules.ElementAtOrDefault(i - 1);
                            var currSchedule = injectionSchedules.ElementAtOrDefault(i);

                            if (prevSchedule != null && currSchedule != null)
                            {
                                var expectedIntervalDays = (currSchedule.InjectionMonth - prevSchedule.InjectionMonth) * 30;
                                if ((curr.InjectionDate - prev.InjectionDate).Days < expectedIntervalDays)
                                {
                                    throw new ArgumentException(
                                        $"Khoảng cách giữa mũi {prevSchedule.InjectionNumber} và {currSchedule.InjectionNumber} của vaccine {vaccine.Name} cần tối thiểu {expectedIntervalDays / 30} tháng."
                                    );
                                }
                            }
                        }
                    }
                }
            }

            var allDates = bookingDto.BookingDetails.Select(bd => bd.InjectionDate.Date).ToList();
            var duplicateDates = allDates.GroupBy(d => d).Where(g => g.Count() > 1).Select(g => g.Key).ToList();

            if (duplicateDates.Any())
            {
                throw new ArgumentException(
                    $"Có nhiều mũi tiêm trùng ngày vào ngày {string.Join(", ", duplicateDates.Select(d => d.ToString("dd/MM/yyyy")))}."
                );
            }

            var comboVaccineIds = bookingDto.BookingDetails
                .Where(bd => bd.ComboVaccineId.HasValue)
                .Select(bd => bd.ComboVaccineId.Value)
                .ToList();

            var vaccineIds = bookingDto.BookingDetails
                .Where(bd => bd.VaccineId.HasValue)
                .Select(bd => bd.VaccineId.Value)
                .ToList();

            if (comboVaccineIds.Intersect(vaccineIds).Any())
            {
                throw new ArgumentException("Có vaccine trong combo đã được chọn làm vaccine lẻ.");
            }
        }



        public async Task<BookingDTO> CancelBookingAsync(int bookingId, string userId)
        {
            var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);
            if (booking == null)
            {
                throw new ArgumentException($"Đặt chỗ bằng ID {bookingId} không tìm thấy");
            }

            if (booking.Status != BookingStatus.Pending)
            {
                throw new ArgumentException("Chỉ những đặt phòng có trạng thái 'Đang chờ xử lý' mới có thể bị hủy.");
            }

            if (booking.UserId != userId)
            {
                throw new ArgumentException("Bạn không được phép hủy đặt chỗ này.");
            }

            booking.Status = BookingStatus.Cancelled;
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<BookingDTO>(booking);
        }
        public async Task<bool> AssignDoctorToBooking(int bookingId, string userId)
        {
            var booking = await _unitOfWork.Bookings.GetBookingWithDetailsAsync(bookingId);
            if (booking == null)
                throw new ArgumentException("Không tìm thấy đặt chỗ.");

            // ✅ Kiểm tra trạng thái booking
            if (booking.Status != BookingStatus.Confirmed)
                throw new ArgumentException("Chỉ có thể gán bác sĩ khi trạng thái là 'Confirmed'.");

            // ✅ Kiểm tra xem đã có bác sĩ được gán chưa
            if (booking.DoctorWorkScheduleId.HasValue)
                throw new ArgumentException("Bác sĩ đã được gán cho đặt chỗ này.");

            // ✅ Tạo lịch làm việc cho bác sĩ
            var doctorSchedule = new DoctorWorkSchedule
            {
                UserId = userId,
                AssignedDate = DateTime.UtcNow
            };

            await _unitOfWork.DoctorWorkSchedules.AddAsync(doctorSchedule);
            await _unitOfWork.CompleteAsync();


            // Trừ vaccine khỏi kho khi lịch tiêm được gán thành công
            foreach (var detail in booking.BookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    await _inventoryService.ExportVaccineAsync(detail.VaccineId.Value, 1);
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    var comboDetails = await _unitOfWork.ComboDetails.GetAllAsync(cd => cd.ComboId == detail.ComboVaccineId);
                    foreach (var comboDetail in comboDetails)
                    {
                        await _inventoryService.ExportVaccineAsync(comboDetail.VaccineId, 1);
                    }
                }
            }

            // ✅ Gán lịch làm việc vào booking
            booking.DoctorWorkScheduleId = doctorSchedule.DoctorWorkScheduleId;

            booking.Status = BookingStatus.InProgress;

            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<List<BookingDetailDTO>> GetDoctorBookingDetailsAsync(string userId)
        {
            // Lấy tất cả các booking của bác sĩ
            var doctorSchedules = await _unitOfWork.DoctorWorkSchedules
                .GetAllAsync(dws => dws.UserId == userId, includeProperties: "Bookings");

            var bookingIds = doctorSchedules
                .Select(dws => dws.DoctorWorkScheduleId)
                .ToList();

            // Lấy danh sách chi tiết từng mũi tiêm
            var bookingDetails = await _unitOfWork.BookingDetails
                .GetAllAsync(bd => bookingIds.Contains(bd.Booking.DoctorWorkScheduleId.Value),
                             includeProperties: "Vaccine,ComboVaccine");

            var result = new List<BookingDetailDTO>();

            foreach (var detail in bookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    // 👉 Vaccine lẻ
                    result.Add(new BookingDetailDTO
                    {
                        BookingId = detail.Booking.BookingId,
                        BookingDetailId = detail.BookingDetailId, // ✅ Dùng BookingDetailId thay vì BookingId
                        VaccineId = detail.VaccineId,
                        VaccineName = detail.Vaccine?.Name ?? "Không xác định",
                        Status = detail.Status == BookingDetailStatus.Completed
                            ? "Hoàn thành"
                            : "Chưa hoàn thành",
                        BookingDate = detail.BookingDate,
                        InjectionDate = detail.InjectionDate, // ✅ Thêm dòng này
                        Price = detail.Price
                    });
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    // 👉 Nếu là ComboVaccine → Tách từng mũi ra
                    var comboDetails = await _unitOfWork.ComboDetails
                        .GetAllAsync(cd => cd.ComboId == detail.ComboVaccineId.Value);

                    foreach (var comboDetail in comboDetails)
                    {
                        var vaccine = await _unitOfWork.Vaccines
                            .GetAsync(v => v.VaccineId == comboDetail.VaccineId);

                        if (vaccine != null)
                        {
                            result.Add(new BookingDetailDTO
                            {
                                BookingId = detail.Booking.BookingId,
                                BookingDetailId = detail.BookingDetailId, // ✅ Dùng BookingDetailId thay vì BookingId
                                VaccineId = vaccine.VaccineId,
                                VaccineName = vaccine.Name,
                                Status = detail.Status == BookingDetailStatus.Completed
                                    ? "Hoàn thành"
                                    : "Chưa hoàn thành",
                                BookingDate = detail.BookingDate,
                                InjectionDate = detail.InjectionDate, // ✅ Thêm dòng này
                                Price = vaccine.Price,
                                ComboVaccineId = detail.ComboVaccineId,
                                ComboVaccineName = detail.ComboVaccine?.ComboName ?? ""
                            });
                        }
                    }
                }
            }

            return result;
        }


        public async Task<List<BookingDTO>> GetUnassignedBookingsAsync()
        {
            var unassignedBookings = await _unitOfWork.Bookings
                .GetAllAsync(b => b.Status == BookingStatus.Confirmed,
                             includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User");

            return _mapper.Map<List<BookingDTO>>(unassignedBookings);
        }

        public async Task<List<BookingDTO>> GetAllBookingsAsync()
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync(
                includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User");

            var result = _mapper.Map<List<BookingDTO>>(bookings);

            foreach (var bookingDto in result)
            {
                if (bookingDto.ChildId != 0)
                {
                    var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
                    bookingDto.ChildName = child?.FullName ?? "Không xác định";
                }
                else
                {
                    bookingDto.ChildName = "Không xác định";
                }
            }

            return result;
        }

        public async Task<bool> UnassignDoctorFromBookingAsync(int bookingId, string userId)
        {
            var booking = await _unitOfWork.Bookings.GetBookingWithDetailsAsync(bookingId);
            if (booking == null)
                throw new ArgumentException("Không tìm thấy đặt chỗ.");

            // ✅ Chỉ cho phép hủy khi trạng thái là InProgress
            if (booking.Status != BookingStatus.InProgress)
                throw new ArgumentException("Chỉ có thể hủy phân công khi trạng thái là 'InProgress'.");

            var doctorSchedule = await _unitOfWork.DoctorWorkSchedules
                .GetAsync(ds => ds.DoctorWorkScheduleId == booking.DoctorWorkScheduleId);

            if (doctorSchedule == null)
                throw new ArgumentException("Lịch làm việc của bác sĩ không tồn tại hoặc đã bị hủy.");

            // ✅ Bỏ qua kiểm tra quyền → Ai cũng có thể hủy nếu trạng thái hợp lệ
            _unitOfWork.DoctorWorkSchedules.DeleteAsync(doctorSchedule);

            booking.DoctorWorkScheduleId = null;
            booking.Status = BookingStatus.Confirmed;

            await _unitOfWork.CompleteAsync();

            return true;
        }
        public async Task<bool> CompleteBookingDetailAsync(int bookingDetailId)
        {
            var bookingDetail = await _unitOfWork.BookingDetails.GetAsync(bd => bd.BookingDetailId == bookingDetailId);

            if (bookingDetail == null)
                throw new ArgumentException("Không tìm thấy chi tiết đặt chỗ.");

            // ✅ Đánh dấu mũi tiêm là Completed
            bookingDetail.Status = BookingDetailStatus.Completed;
            await _unitOfWork.CompleteAsync();

            // ✅ Kiểm tra nếu tất cả các mũi trong combo đã hoàn thành
            if (bookingDetail.ComboVaccineId.HasValue)
            {
                var remainingDoses = await _unitOfWork.BookingDetails
                    .GetAllAsync(bd => bd.BookingId == bookingDetail.BookingId &&
                                       bd.ComboVaccineId == bookingDetail.ComboVaccineId &&
                                       bd.Status != BookingDetailStatus.Completed);

                var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingDetail.BookingId);

                if (!remainingDoses.Any())
                {
                    // ✅ Nếu tất cả các mũi trong combo đã hoàn thành → Giữ trạng thái là InProgress
                    // (KHÔNG chuyển sang Completed tại đây)
                    booking.Status = BookingStatus.InProgress;
                }
                else
                {
                    // ✅ Nếu còn mũi chưa tiêm → Giữ trạng thái là InProgress
                    booking.Status = BookingStatus.InProgress;
                }

                await _unitOfWork.CompleteAsync();
            }

            return true;
        }
        public async Task<List<BookingDetailDTO>> GetAllBookingDetailsByUserIdAsync(string userId)
        {
            // ✅ Lấy tất cả các booking của user
            var bookings = await _unitOfWork.Bookings
                .GetAllAsync(b => b.UserId == userId,
                             includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children");

            if (bookings == null || !bookings.Any())
            {
                throw new ArgumentException("Không tìm thấy lịch tiêm cho người dùng này.");
            }

            // ✅ Sử dụng `.SelectMany()` để trả về từng BookingDetail thay vì từng Booking
            var result = bookings
                .SelectMany(b => b.BookingDetails
                    .Select(detail => new BookingDetailDTO
                    {
                        BookingId = detail.Booking.BookingId, // ✅ Lấy BookingId từ BookingDetail
                        BookingDetailId = detail.BookingDetailId,
                        VaccineId = detail.VaccineId,
                        VaccineName = detail.Vaccine?.Name ?? "Không xác định",
                        BookingDate = detail.BookingDate,
                        InjectionDate = detail.InjectionDate,
                        Price = detail.Price,
                        Status = detail.Status == BookingDetailStatus.Completed ? "Hoàn thành" : "Chưa hoàn thành",
                        ComboVaccineId = detail.ComboVaccineId,
                        ComboVaccineName = detail.ComboVaccine?.ComboName,
                        BookingType = detail.BookingType.ToString() // ✅ Lấy loại vaccine (single/combo)
                    })
                )
                .ToList();

            return result;
        }


    }
}
