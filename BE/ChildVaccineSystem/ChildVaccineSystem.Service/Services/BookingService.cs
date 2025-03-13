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

namespace ChildVaccineSystem.Service.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVaccineInventoryService _inventoryService;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, IVaccineInventoryService inventoryService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _inventoryService = inventoryService;
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

            // Ánh xạ tên Vaccine và tên Combo Vaccine
            foreach (var detail in bookingDTO.BookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId.Value);
                    detail.VaccineName = vaccine?.Name; // ✅ Lấy tên Vaccine
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detail.ComboVaccineId.Value);
                    detail.ComboVaccineName = comboVaccine?.ComboName; // ✅ Lấy tên Combo Vaccine
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


        public async Task<BookingDTO> CreateAsync(string userId, CreateBookingDTO bookingDto)
        {
            await ValidateBooking(userId, bookingDto);

            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            booking.BookingDetails = new List<BookingDetail>();

            decimal totalPrice = 0;

            // Validate that the child belongs to the current user
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
            if (child == null || child.UserId != userId)
            {
                throw new ArgumentException("Đứa trẻ này không thuộc về người dùng hiện tại.");
            }

            // Get the appropriate PricingPolicy based on booking date and current date
            var pricingPolicy = await GetPricingPolicyForBookingAsync(bookingDto.BookingDate);

            if (pricingPolicy != null)
            {
                booking.PricingPolicyId = pricingPolicy.PricingPolicyId;

                // If there's a valid pricing policy, apply discount
                if (pricingPolicy.DiscountPercent > 0)
                {
                    decimal discountAmount = totalPrice * (pricingPolicy.DiscountPercent / 100);
                    totalPrice -= discountAmount;  // Apply the discount
                }
            }
            else
            {
                booking.PricingPolicyId = null; // Ensure PricingPolicyId is null if no valid pricing policy
            }

            // Calculate total price for booking details
            foreach (var detailDto in bookingDto.BookingDetails)
            {
                var bookingDetail = _mapper.Map<BookingDetail>(detailDto);

                if (detailDto.VaccineId.HasValue)
                {
                    booking.BookingType = BookingType.singleVaccine; 
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detailDto.VaccineId);
                    bookingDetail.Price = vaccine.Price;
					// Lấy VaccineInventoryId phù hợp với VaccineId
					var vaccineInventory = await _unitOfWork.VaccineInventories
						.GetAsync(vi => vi.VaccineId == vaccine.VaccineId);

					if (vaccineInventory == null)
					{
						throw new ArgumentException($"Không tìm thấy hàng tồn kho cho VaccineId {vaccine.VaccineId}");
					}

					bookingDetail.VaccineInventoryId = vaccineInventory.VaccineInventoryId;
				}
                else
                {
					booking.BookingType = BookingType.comboVacinne;
					var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detailDto.ComboVaccineId);
                    bookingDetail.Price = comboVaccine.TotalPrice;
                }

                booking.BookingDetails.Add(bookingDetail);
                totalPrice += bookingDetail.Price;
            }

            // Apply the discount again, after calculating the total price for booking details
            if (pricingPolicy != null && pricingPolicy.DiscountPercent > 0)
            {
                decimal discountAmount = totalPrice * (pricingPolicy.DiscountPercent / 100);
                totalPrice -= discountAmount;  // Apply the discount to total price
            }

            // Assign the final total price
            booking.TotalPrice = totalPrice;

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();

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
            // Validate booking date
            if (bookingDto.BookingDate < DateTime.Now)
                throw new ArgumentException("Ngày đặt phòng không thể là ngày trong quá khứ");

            // ✅ Kiểm tra nếu cùng một đứa trẻ đã có booking trong cùng ngày
            var existingBooking = await _unitOfWork.Bookings.GetAsync(
                b => b.UserId == userId &&
                     b.BookingDate.Date == bookingDto.BookingDate.Date &&
                     b.ChildId == bookingDto.ChildId
            );

            if (existingBooking != null)
            {
                throw new ArgumentException("Trẻ này đã được đặt chỗ vào ngày này.");
            }

            // ✅ Không cần kiểm tra xung đột theo `userId` nữa vì đã kiểm tra theo `childId`
            // (Loại bỏ kiểm tra theo HasConflictingBookingAsync)

            // Validate child exists and belongs to the current user
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
            if (child == null || child.UserId != userId)
                throw new ArgumentException("Không tìm thấy đứa trẻ hoặc không thuộc về người dùng");

            // Validate booking details exist
            if (!bookingDto.BookingDetails.Any())
                throw new ArgumentException("Đặt chỗ phải có ít nhất một loại vắc xin hoặc vắc xin kết hợp");

            // Validate booking type consistency
            bool hasVaccine = bookingDto.BookingDetails.Any(bd => bd.VaccineId.HasValue);
            bool hasComboVaccine = bookingDto.BookingDetails.Any(bd => bd.ComboVaccineId.HasValue);

            if (hasVaccine && hasComboVaccine)
                throw new ArgumentException("Không thể kết hợp vắc xin riêng lẻ và vắc xin combo trong cùng một lần đặt chỗ");

            if (!hasVaccine && !hasComboVaccine)
                throw new ArgumentException("Việc đặt chỗ phải nêu rõ vắc xin hoặc vắc xin kết hợp");

            // Validate vaccines
            foreach (var detail in bookingDto.BookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId);
                    if (vaccine == null)
                        throw new ArgumentException($"Không tìm thấy vắc xin: {detail.VaccineId}");
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detail.ComboVaccineId);
                    if (comboVaccine == null)
                        throw new ArgumentException($"Không tìm thấy vắc xin kết hợp: {detail.ComboVaccineId}");
                }
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

            if (booking.Status != BookingStatus.Confirmed)
                throw new ArgumentException("Chỉ những đặt phòng đã được xác nhận mới có thể được chỉ định cho bác sĩ.");

            var doctorSchedule = new DoctorWorkSchedule
            {
                BookingId = bookingId,
                UserId = userId
            };

            await _unitOfWork.DoctorWorkSchedules.AddAsync(doctorSchedule);

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

            booking.Status = BookingStatus.InProgress;
            await _unitOfWork.CompleteAsync();

            return true;
        }


        public async Task<List<BookingDTO>> GetDoctorBookingsAsync(string userId)
        {
            var doctorSchedules = await _unitOfWork.DoctorWorkSchedules
                .GetAllAsync(dws => dws.UserId == userId, includeProperties: "Booking");

            var bookingIds = doctorSchedules.Select(dws => dws.BookingId).ToList();

            var bookings = await _unitOfWork.Bookings
                .GetAllAsync(b => bookingIds.Contains(b.BookingId), includeProperties: "User,Children");

            return _mapper.Map<List<BookingDTO>>(bookings);
        }
        //public async Task<BookingDTO> CompleteBookingAsync(int bookingId, string userId)
        //{
        //    var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);

        //    if (booking == null)
        //        throw new ArgumentException("Booking not found.");

        //    if (booking.Status != BookingStatus.InProgress)
        //        throw new ArgumentException("Only in-progress bookings can be marked as completed.");

        //    // ✅ Kiểm tra userId thay cho doctorId
        //    var doctorSchedule = await _unitOfWork.DoctorWorkSchedules.GetAsync(
        //        ds => ds.BookingId == bookingId && ds.UserId == userId);

        //    if (doctorSchedule == null)
        //        throw new ArgumentException("You are not assigned to this booking.");

        //    // ✅ Chuyển trạng thái sang Completed
        //    booking.Status = BookingStatus.Completed;

        //    await _unitOfWork.CompleteAsync();

        //    return _mapper.Map<BookingDTO>(booking);
        //}

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

            return _mapper.Map<List<BookingDTO>>(bookings);
        }
    }
}
