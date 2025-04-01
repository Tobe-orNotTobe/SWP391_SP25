using AutoMapper;
using ChildVaccineSystem.Data.DTO.VaccineRecord;
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
    public class VaccineRecordService : IVaccineRecordService
    {
        private readonly IVaccineRecordRepository _vaccineRecordRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IComboVaccineRepository _comboVaccineRepository;

        public VaccineRecordService(IVaccineRecordRepository vaccineRecordRepository, IUnitOfWork unitOfWork, IMapper mapper, IComboVaccineRepository comboVaccineRepository)
        {
            _vaccineRecordRepository = vaccineRecordRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _comboVaccineRepository = comboVaccineRepository;
        }

        public async Task<VaccineRecordDTO> CreateVaccinationRecordAsync(int bookingDetailId, string doctorId)
        {
            if (bookingDetailId <= 0)
                throw new ArgumentException("Mã chi tiết đặt lịch không hợp lệ.");

            // 🔥 Lấy thông tin BookingDetail
            var detail = await _unitOfWork.BookingDetails.GetAsync(
                bd => bd.BookingDetailId == bookingDetailId,
                includeProperties: "Vaccine,Booking.Children"
            );

            if (detail == null)
                throw new Exception("Không tìm thấy chi tiết lịch tiêm.");

            var booking = detail.Booking;
            if (booking == null)
                throw new Exception("Không tìm thấy thông tin đặt lịch.");

            // ✅ Kiểm tra nếu bác sĩ được gán cho lịch tiêm này
            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(booking.BookingId, doctorId);
            if (!isDoctorAssigned)
                throw new UnauthorizedAccessException("Bạn không có quyền tạo hồ sơ cho lịch này.");

            if (booking.Status != BookingStatus.InProgress)
                throw new Exception("Chỉ có thể tạo hồ sơ tiêm chủng khi lịch tiêm đang được tiến hành.");

            if (detail.VaccineId == null && detail.ComboVaccineId == null)
                throw new Exception("Chi tiết lịch tiêm không chứa thông tin Vaccine hoặc Combo Vaccine.");

            if (booking.Children == null)
                throw new Exception("Không tìm thấy thông tin trẻ em.");

            // 🔥 Kiểm tra xem VaccineRecord đã tồn tại cho BookingDetailId chưa
            var existingRecord = await _unitOfWork.VaccineRecords.GetAllAsync(vr => vr.BookingDetailId == bookingDetailId);
            if (existingRecord.Any())
                throw new Exception("Hồ sơ tiêm chủng cho mũi tiêm này đã được tạo.");

            var vaccineRecords = new List<VaccineRecordDetailDTO>();

            try
            {
                if (detail.VaccineId.HasValue)
                {
                    // ✅ Tạo record cho vaccine lẻ
                    await ProcessVaccineRecord(detail, booking, vaccineRecords);
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    // ✅ Lấy danh sách vaccine trong combo
                    var comboDetails = await _unitOfWork.ComboDetails
                        .GetAllAsync(cd => cd.ComboId == detail.ComboVaccineId.Value);

                    foreach (var comboDetail in comboDetails)
                    {
                        var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == comboDetail.VaccineId);
                        if (vaccine == null)
                            throw new Exception($"Không tìm thấy vaccine ID {comboDetail.VaccineId}");

                        var vaccineInventory = await _unitOfWork.VaccineInventories
                            .GetAsync(vi => vi.VaccineId == comboDetail.VaccineId);

                        if (vaccineInventory == null)
                            throw new Exception($"Không tìm thấy kho vaccine cho vaccine ID {comboDetail.VaccineId}");

                        var sequence = await GetCurrentVaccineSequenceAsync(booking.Children.ChildId, comboDetail.VaccineId);

                        // 🔥 FIX: Lấy ngày nhắc lại theo từng vaccine riêng biệt
                        var nextDoseDate = await CalculateNextDoseDateAsync(comboDetail.VaccineId, sequence);

                        // ✅ Tạo record riêng cho từng mũi trong combo
                        var vaccinationRecord = new VaccinationRecord
                        {
                            BookingDetailId = detail.BookingDetailId,
                            UserId = booking.UserId,
                            ChildId = booking.Children.ChildId,
                            VaccineId = comboDetail.VaccineId,
                            VaccineInventoryId = vaccineInventory.VaccineInventoryId,
                            VaccinationDate = DateTime.Now,
                            DoseAmount = vaccine.DoseAmount,
                            Sequence = sequence,
                            Status = VaccineRecordStatus.Completed,
                            Notes = "Tiêm chủng hoàn tất",
                            BatchNumber = vaccineInventory.BatchNumber,
                            NextDoseDate = nextDoseDate,
                            Price = vaccine.Price
                        };

                        await _vaccineRecordRepository.AddAsync(vaccinationRecord);

                        vaccineRecords.Add(new VaccineRecordDetailDTO
                        {
                            VaccinationRecordId = vaccinationRecord.VaccinationRecordId,
                            VaccineName = vaccine.Name,
                            DoseAmount = vaccine.DoseAmount,
                            Price = vaccine.Price,
                            NextDoseDate = nextDoseDate, // ✅ Gán đúng ngày nhắc lại theo từng vaccine riêng biệt
                            BatchNumber = vaccinationRecord.BatchNumber,
                            StatusEnum = VaccineRecordStatus.Completed,
                            Notes = "Tiêm chủng hoàn tất"
                        });
                    }
                }

                // ✅ Cập nhật trạng thái booking detail thành `Completed`
                detail.Status = BookingDetailStatus.Completed;
                await _unitOfWork.BookingDetails.UpdateAsync(detail);
                await _unitOfWork.CompleteAsync();

                // 🔥 🔥 🔥 FIX: Cập nhật trạng thái của booking nếu tất cả các mũi trong combo đã hoàn thành
                var remainingDoses = await _unitOfWork.BookingDetails
                    .GetAllAsync(bd => bd.BookingId == booking.BookingId &&
                                       bd.ComboVaccineId == detail.ComboVaccineId &&
                                       bd.Status != BookingDetailStatus.Completed);

                if (!remainingDoses.Any())
                {
                    // ✅ Nếu không còn mũi nào trong combo → Cập nhật trạng thái booking thành COMPLETED
                    booking.Status = BookingStatus.Completed;
                }
                else
                {
                    // ✅ Nếu vẫn còn mũi → Giữ trạng thái là InProgress
                    booking.Status = BookingStatus.InProgress;
                }

                await _unitOfWork.Bookings.UpdateAsync(booking);
                await _unitOfWork.CompleteAsync();

                return new VaccineRecordDTO
                {
                    BookingId = booking.BookingId,
                    FullName = booking.Children.FullName,
                    DateOfBirth = booking.Children.DateOfBirth,
                    Height = booking.Children.Height,
                    Weight = booking.Children.Weight,
                    VaccineRecords = vaccineRecords, // ✅ Kết quả trả về chính xác
                    Message = "Hồ sơ vắc-xin đã được xác nhận thành công."
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lưu dữ liệu: {ex.Message}", ex);
            }
        }


        public async Task ProcessVaccineRecord(BookingDetail detail, Booking booking, List<VaccineRecordDetailDTO> vaccineRecords)
        {
            var vaccineInventory = await _unitOfWork.VaccineInventories
                .GetAsync(vi => vi.VaccineInventoryId == detail.VaccineInventoryId);

            if (vaccineInventory == null)
                throw new Exception("Không tìm thấy VaccineInventory.");

            // Lấy số thứ tự mũi tiêm (sequence)
            var sequence = await GetCurrentVaccineSequenceAsync(booking.Children.ChildId, detail.VaccineId.Value);

            // ✅ Tìm `BookingDate` của mũi tiếp theo trong combo hoặc vaccine lẻ
            DateTime? nextDoseDate = null;

            if (detail.ComboVaccineId.HasValue)
            {
                // ✅ Đối với combo vaccine → Lấy từ `BookingDate` của mũi tiếp theo
                nextDoseDate = await GetNextDoseDateForComboAsync(booking.BookingId, detail.ComboVaccineId.Value, detail.BookingDetailId);
            }
            else
            {
                // ✅ Đối với vaccine lẻ → Lấy từ `InjectionSchedule`
                nextDoseDate = await CalculateNextDoseDateAsync(detail.VaccineId.Value, sequence);

                // 🔥 Nếu không có lịch tiêm → Dùng BookingDate hiện tại + 30 ngày (hoặc 1 giá trị mặc định)
                if (!nextDoseDate.HasValue)
                {
                    nextDoseDate = DateTime.Now.AddDays(30); // ✅ Mặc định 30 ngày
                }
            }

            var vaccinationRecord = new VaccinationRecord
            {
                BookingDetailId = detail.BookingDetailId,
                UserId = booking.UserId,
                ChildId = booking.Children.ChildId,
                VaccineId = detail.VaccineId.Value,
                VaccineInventoryId = vaccineInventory.VaccineInventoryId,
                VaccinationDate = DateTime.Now,
                DoseAmount = detail.Vaccine.DoseAmount,
                Sequence = sequence,
                Status = VaccineRecordStatus.Completed,
                Notes = "Tiêm chủng hoàn tất",
                BatchNumber = vaccineInventory.BatchNumber,
                NextDoseDate = nextDoseDate, // ✅ Gán đúng ngày nhắc lại
                Price = detail.Vaccine.Price,
            };

            await _vaccineRecordRepository.AddAsync(vaccinationRecord);

            vaccineRecords.Add(new VaccineRecordDetailDTO
            {
                VaccineName = detail.Vaccine.Name,
                DoseAmount = detail.Vaccine.DoseAmount,
                Price = detail.Vaccine.Price,
                NextDoseDate = nextDoseDate, // ✅ Trả về ngày nhắc lại chính xác
                BatchNumber = vaccinationRecord.BatchNumber,
                StatusEnum = VaccineRecordStatus.Completed,
                Notes = "Đã tiêm chủng"
            });
        }


        // ✅ Tìm BookingDate của mũi tiêm tiếp theo trong combo
        private async Task<DateTime?> GetNextDoseDateForComboAsync(int bookingId, int comboVaccineId, int currentBookingDetailId)
        {
            var nextDose = await _unitOfWork.BookingDetails
                .GetAllAsync(bd => bd.BookingId == bookingId
                                && bd.ComboVaccineId == comboVaccineId
                                && bd.Status == BookingDetailStatus.Pending
                                && bd.BookingDate > DateTime.Now
                                && bd.BookingDetailId != currentBookingDetailId); // ❗ Bỏ qua mũi hiện tại

            // 🔎 Tìm mũi kế tiếp theo thứ tự `BookingDate`
            var nextDoseDetail = nextDose
                .OrderBy(bd => bd.BookingDate)
                .FirstOrDefault();

            return nextDoseDetail?.BookingDate; // ✅ Trả về ngày của mũi kế tiếp
        }



        public async Task<DateTime?> CalculateNextDoseDateAsync(int vaccineId, int sequence)
        {
            var injectionSchedule = await _unitOfWork.InjectionSchedules
                .GetAllAsync(schedule => schedule.VaccineScheduleDetail.VaccineId == vaccineId);

            // ✅ Kiểm tra nếu không có lịch tiêm nào → Trả về null
            if (injectionSchedule == null || !injectionSchedule.Any())
            {
                return null;
            }

            // ✅ Tìm mũi tiêm tiếp theo (sequence + 1)
            var nextInjection = injectionSchedule.FirstOrDefault(schedule => schedule.InjectionNumber == sequence + 1);

            if (nextInjection != null)
            {
                // ✅ Nếu tìm thấy InjectionSchedule → Cộng thêm InjectionMonth
                return DateTime.Now.AddMonths(nextInjection.InjectionMonth);
            }
            else
            {
                // ✅ Nếu không có InjectionSchedule → Dùng mặc định + 30 ngày
                return DateTime.Now.AddDays(30);
            }
        }

        public async Task<int> GetCurrentVaccineSequenceAsync(int childId, int vaccineId)
        {
            var previousRecords = await _vaccineRecordRepository.GetAllAsync(
                vr => vr.ChildId == childId && vr.VaccineId == vaccineId
            );

            return previousRecords.Count() + 1; // Mũi tiêm tiếp theo
        }


        public async Task<VaccineRecordDTO> GetVaccineRecordByIdAsync(int vaccineRecordId, string userId, bool isAdmin, bool isStaff)
        {
            if (vaccineRecordId <= 0)
                throw new ArgumentException("VaccineRecord ID không hợp lệ.");

            var record = await _vaccineRecordRepository.GetByIdAsync(
            vaccineRecordId,
            includeProperties: "Vaccine,BookingDetail.Booking,Child"
);

            if (record == null)
                throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng.");

            if (record.Status == VaccineRecordStatus.Deleted)
                throw new InvalidOperationException("Hồ sơ này đã bị xóa.");


            // Lấy UserId từ BookingDetail (customer của booking)
            var customerId = record.BookingDetail.Booking.UserId;

            // Kiểm tra trong bảng DoctorWorkSchedules xem bác sĩ có được gán cho BookingId này không
            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(record.BookingDetail.BookingId, userId);


            // Kiểm tra nếu user hiện tại là Customer của Booking
            bool isCustomer = customerId == userId;

            // Nếu không phải Admin, không phải Staff, không phải Doctor được chỉ định, cũng không phải Customer (chủ hồ sơ), thì không cho truy cập.
            // Kiểm tra điều kiện đúng nhất (Admin hoặc Staff luôn có quyền truy cập)
            if (!(isAdmin || isStaff || isDoctorAssigned || isCustomer))
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập hồ sơ này.");
            }

            return new VaccineRecordDTO
            {
                BookingId = record.BookingDetail.BookingId,
                FullName = record.Child.FullName,
                DateOfBirth = record.Child.DateOfBirth,
                Height = record.Child.Height,
                Weight = record.Child.Weight,
                VaccineRecords = new List<VaccineRecordDetailDTO>
        {
            new VaccineRecordDetailDTO
            {
                VaccinationRecordId = record.VaccinationRecordId,
                VaccineName = record.Vaccine.Name,
                DoseAmount = record.DoseAmount,
                BatchNumber = record.BatchNumber,
                Price = Convert.ToDecimal(record.Price),
                StatusEnum = record.Status,
                NextDoseDate = record.NextDoseDate,
                Notes = record.Notes
            }
        }
            };
        }


        public async Task<bool> SoftDeleteVaccineRecordAsync(int vaccineRecordId, string userId, bool isAdmin, bool isStaff)
        {
            if (vaccineRecordId <= 0)
                throw new ArgumentException("VaccineRecord ID không hợp lệ.");

            var record = await _vaccineRecordRepository.GetByIdAsync(
                vaccineRecordId,
                includeProperties: "BookingDetail.Booking"
            );

            if (record == null)
                throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng.");

            // Kiểm tra quyền bác sĩ dựa trên `DoctorWorkSchedules`
            // Kiểm tra trong bảng DoctorWorkSchedules xem bác sĩ có được gán cho BookingId này không
            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(record.BookingDetail.BookingId, userId);
            // Chỉ Admin, Staff và Doctor được chỉ định mới có quyền xóa
            if (!(isAdmin || isStaff || isDoctorAssigned))
                throw new UnauthorizedAccessException("Bạn không có quyền xóa hồ sơ này.");

            if (record.Status == VaccineRecordStatus.Deleted)
                throw new InvalidOperationException("Hồ sơ này đã bị xóa trước đó.");

            record.Status = VaccineRecordStatus.Deleted;
            _vaccineRecordRepository.Update(record);
            await _unitOfWork.CompleteAsync();

            return true;
        }


        public async Task<IEnumerable<VaccineRecordDTO>> GetAllVaccineRecordsAsync(string userId, bool isAdmin, bool isStaff)
        {
            // Lấy tất cả BookingId mà bác sĩ này được gán
            var allBookings = await _unitOfWork.Bookings.GetAllAsync();
            var assignedBookingIds = new List<int>();

            foreach (var booking in allBookings)
            {
                if (await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(booking.BookingId, userId))
                {
                    assignedBookingIds.Add(booking.BookingId);
                }
            }

            var records = await _vaccineRecordRepository.GetAllAsync(
                vr => (isAdmin || isStaff || assignedBookingIds.Contains(vr.BookingDetail.BookingId) || vr.BookingDetail.Booking.UserId == userId)
                    && vr.Status != VaccineRecordStatus.Deleted,
                includeProperties: "Vaccine,BookingDetail,BookingDetail.Booking,Child"
            );

            if (records == null || !records.Any())
                throw new KeyNotFoundException("Không có hồ sơ tiêm chủng nào.");

            return records
                .GroupBy(record => record.BookingDetail.BookingId)
                .Select(group => new VaccineRecordDTO
                {
                    BookingId = group.Key,
                    FullName = group.First().Child.FullName,
                    DateOfBirth = group.First().Child.DateOfBirth,
                    Height = group.First().Child.Height,
                    Weight = group.First().Child.Weight,
                    VaccineRecords = group.Select(record => new VaccineRecordDetailDTO
                    {
                        VaccinationRecordId = record.VaccinationRecordId,
                        VaccineName = record.Vaccine.Name,
                        DoseAmount = record.DoseAmount,
                        BatchNumber = record.BatchNumber,
                        Price = Convert.ToDecimal(record.Price),
                        StatusEnum = record.Status,
                        NextDoseDate = record.NextDoseDate,
                        Notes = record.Notes
                    }).ToList()
                }).ToList();
        }




        public async Task<bool> UpdateVaccineRecordAsync(int vaccineRecordId, UpdateVaccineRecordDTO updateDto, string userId, bool isAdmin, bool isStaff)
        {
            if (vaccineRecordId <= 0)
                throw new ArgumentException("VaccineRecord ID không hợp lệ.");

            if (updateDto == null)
                throw new ArgumentNullException(nameof(updateDto), "Dữ liệu cập nhật không được để trống.");

            var record = await _vaccineRecordRepository.GetByIdAsync(
                vaccineRecordId,
                includeProperties: "BookingDetail.Booking"
            );

            if (record == null)
                throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng.");

            // Kiểm tra xem bác sĩ có quyền cập nhật lịch này không
            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(record.BookingDetail.BookingId, userId);


            // Phân quyền: chỉ Admin, Staff hoặc Doctor được chỉ định mới có quyền
            if (!(isAdmin || isStaff || isDoctorAssigned))
                throw new UnauthorizedAccessException("Bạn không có quyền cập nhật hồ sơ này.");

            if (record.Status == VaccineRecordStatus.Deleted)
                throw new InvalidOperationException("Không thể cập nhật hồ sơ đã bị xóa.");

            if (record.Status == VaccineRecordStatus.Completed && updateDto.Status != VaccineRecordStatus.Completed)
                throw new InvalidOperationException("Không thể thay đổi trạng thái của hồ sơ đã hoàn tất.");

            if (updateDto.Status.HasValue)
                record.Status = updateDto.Status.Value;

            if (!string.IsNullOrEmpty(updateDto.Notes))
                record.Notes = updateDto.Notes;

            if (updateDto.NextDoseDate.HasValue)
            {
                if (updateDto.NextDoseDate.Value < DateTime.Now)
                    throw new ArgumentException("Ngày tiêm tiếp theo không thể nhỏ hơn ngày hiện tại.");

                record.NextDoseDate = updateDto.NextDoseDate.Value;
            }

            _vaccineRecordRepository.Update(record);
            await _unitOfWork.CompleteAsync();

            return true;
        }


        public async Task<VaccineRecordDTO> GetVaccineRecordsByBookingIdAsync(int bookingId, string userId, bool isAdmin, bool isStaff)
        {
            if (bookingId <= 0)
                throw new ArgumentException("Booking ID không hợp lệ.");

            var records = await _vaccineRecordRepository.GetAllAsync(
                vr => vr.BookingDetail.BookingId == bookingId
                   && vr.BookingDetail != null
                   && vr.BookingDetail.Booking != null,
                includeProperties: "Vaccine,BookingDetail,BookingDetail.Booking,Child"
            );

            if (records == null || !records.Any())
                throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng cho Booking ID này.");

            var activeRecords = records.Where(r => r.Status != VaccineRecordStatus.Deleted).ToList();

            if (!activeRecords.Any())
                throw new InvalidOperationException("Tất cả hồ sơ trong booking này đã bị xóa.");

            var firstRecord = activeRecords.First();

            var customerId = firstRecord.BookingDetail.Booking.UserId;

            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(bookingId, userId);

            bool isCustomer = customerId == userId;

            if (!(isAdmin || isStaff || isDoctorAssigned || isCustomer))
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập hồ sơ này.");

            return new VaccineRecordDTO
            {
                BookingId = bookingId,
                FullName = firstRecord.Child.FullName,
                DateOfBirth = firstRecord.Child.DateOfBirth,
                Height = firstRecord.Child.Height,
                Weight = firstRecord.Child.Weight,
                VaccineRecords = activeRecords.Select(record => new VaccineRecordDetailDTO
                {
                    VaccinationRecordId = record.VaccinationRecordId,
                    VaccineName = record.Vaccine.Name,
                    DoseAmount = record.DoseAmount,
                    BatchNumber = record.BatchNumber,
                    Price = Convert.ToDecimal(record.Price),
                    StatusEnum = record.Status,
                    NextDoseDate = record.NextDoseDate,
                    Notes = record.Notes
                }).ToList()
            };
        }

        public async Task<VaccineRecordDTO> GetVaccineRecordByBookingDetailIdAsync(int bookingDetailId, string userId, bool isAdmin, bool isStaff)
        {
            if (bookingDetailId <= 0)
                throw new ArgumentException("BookingDetail ID không hợp lệ.");

            var records = await _vaccineRecordRepository.GetAllAsync(
                vr => vr.BookingDetailId == bookingDetailId,
                includeProperties: "Vaccine,BookingDetail,BookingDetail.Booking,Child"
            );

            if (records == null || !records.Any())
                throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng cho BookingDetail ID này.");

            var firstRecord = records.First();
            var customerId = firstRecord.BookingDetail.Booking.UserId;

            bool isDoctorAssigned = await _unitOfWork.Bookings.IsDoctorAssignedToBookingAsync(firstRecord.BookingDetail.BookingId, userId);
            bool isCustomer = customerId == userId;

            if (!(isAdmin || isStaff || isDoctorAssigned || isCustomer))
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập hồ sơ này.");

            return new VaccineRecordDTO
            {
                BookingId = firstRecord.BookingDetail.BookingId,
                FullName = firstRecord.Child.FullName,
                DateOfBirth = firstRecord.Child.DateOfBirth,
                Height = firstRecord.Child.Height,
                Weight = firstRecord.Child.Weight,
                VaccineRecords = records.Select(record => new VaccineRecordDetailDTO
                {
                    VaccinationRecordId = record.VaccinationRecordId,
                    VaccineName = record.Vaccine.Name,
                    DoseAmount = record.DoseAmount,
                    BatchNumber = record.BatchNumber,
                    Price = Convert.ToDecimal(record.Price),
                    StatusEnum = record.Status,
                    NextDoseDate = record.NextDoseDate,
                    Notes = record.Notes
                }).ToList()
            };
        }
    }
}
