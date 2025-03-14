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

        public VaccineRecordService(IVaccineRecordRepository vaccineRecordRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _vaccineRecordRepository = vaccineRecordRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

		public async Task<VaccineRecordDTO> CreateVaccinationRecordAsync(int bookingId, string doctorId)
		{
			if (bookingId <= 0)
				throw new ArgumentException("Mã đặt lịch không hợp lệ.");

			// Kiểm tra xem bác sĩ có được gán cho Booking này không
			bool isDoctorAssigned = await _unitOfWork.DoctorWorkSchedules
				.AnyAsync(dws => dws.BookingId == bookingId && dws.UserId == doctorId);

			if (!isDoctorAssigned)
				throw new UnauthorizedAccessException("Bạn không có quyền tạo hồ sơ cho lịch này.");

			var booking = await _unitOfWork.Bookings.GetAsync(
				b => b.BookingId == bookingId,
				includeProperties: "BookingDetails.Vaccine,Children"
			);

			if (booking == null)
				throw new Exception("Không tìm thấy lịch tiêm.");

			if (booking.Status != BookingStatus.InProgress)
				throw new Exception("Chỉ có thể tạo hồ sơ tiêm chủng khi lịch tiêm đang được tiến hành.");

			if (booking.BookingDetails == null || !booking.BookingDetails.Any())
				throw new Exception("Không có chi tiết lịch tiêm hợp lệ.");

			if (booking.Children == null)
				throw new Exception("Không tìm thấy thông tin trẻ em.");

			// Kiểm tra nếu VaccineRecord đã tồn tại
			var existingRecords = await _unitOfWork.VaccineRecords.GetAllAsync(vr => vr.BookingDetail.BookingId == bookingId);
			if (existingRecords.Any())
				throw new Exception("Hồ sơ tiêm chủng cho lịch này đã được tạo.");

			var vaccineRecords = new List<VaccineRecordDetailDTO>();

			try
			{
				foreach (var detail in booking.BookingDetails)
				{
					if (detail.VaccineId.HasValue)
					{
						await ProcessVaccineRecord(detail, booking, vaccineRecords);
					}
					else if (detail.ComboVaccineId.HasValue)
					{
						var comboVaccineDetails = await _unitOfWork.ComboDetails.GetAllAsync(cv => cv.ComboId == detail.ComboVaccineId);

						if (!comboVaccineDetails.Any())
							throw new Exception($"Không tìm thấy danh sách vaccine cho combo ID: {detail.ComboVaccineId}");

						foreach (var comboVaccineDetail in comboVaccineDetails)
						{
							var vaccine = await _unitOfWork.Vaccines.GetByIdAsync(comboVaccineDetail.VaccineId);
							if (vaccine == null)
								throw new Exception($"Không tìm thấy Vaccine với ID: {comboVaccineDetail.VaccineId}");

							var vaccineInventory = await _unitOfWork.VaccineInventories
								.GetAsync(vi => vi.VaccineInventoryId == comboVaccineDetail.VaccineInventoryId
											 || vi.VaccineId == comboVaccineDetail.VaccineId);

							if (vaccineInventory == null || vaccineInventory.QuantityInStock <= 0)
								throw new Exception($"Vaccine Inventory không có sẵn cho VaccineId: {comboVaccineDetail.VaccineId}");

							// 🔹 Kiểm tra nếu vaccine đã tồn tại trong danh sách
							if (vaccineRecords.Any(vr => vr.VaccineName == vaccine.Name))
								continue; // Bỏ qua nếu đã tồn tại

							var sequence = await GetCurrentVaccineSequenceAsync(booking.Children.ChildId, comboVaccineDetail.VaccineId);
							var nextDoseDate = await CalculateNextDoseDateAsync(comboVaccineDetail.VaccineId, sequence);

							var vaccinationRecord = new VaccinationRecord
							{
								BookingDetailId = detail.BookingDetailId,
								UserId = booking.UserId,
								ChildId = booking.Children.ChildId,
								VaccineId = comboVaccineDetail.VaccineId,
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
							await _unitOfWork.CompleteAsync();

							vaccineRecords.Add(new VaccineRecordDetailDTO
							{
								VaccinationRecordId = vaccinationRecord.VaccinationRecordId,
								VaccineName = vaccine.Name,
								DoseAmount = vaccine.DoseAmount,
								Price = vaccine.Price,
								NextDoseDate = nextDoseDate,
								BatchNumber = vaccinationRecord.BatchNumber,
								StatusEnum = VaccineRecordStatus.Completed,
								Notes = "Tiêm chủng hoàn tất"
							});
						}

					}
				}

				// Cập nhật trạng thái booking thành COMPLETED
				booking.Status = BookingStatus.Completed;
				_unitOfWork.Bookings.UpdateAsync(booking);

				await _unitOfWork.CompleteAsync();

				return new VaccineRecordDTO
				{
					BookingId = bookingId,
					FullName = booking.Children.FullName,
					DateOfBirth = booking.Children.DateOfBirth,
					Height = booking.Children.Height,
					Weight = booking.Children.Weight,
					VaccineRecords = vaccineRecords,
					Message = "Vaccine record confirmed successfully"
				};
			}
			catch (Exception ex)
			{
				throw new Exception($"Lỗi khi lưu database: {ex.InnerException?.Message ?? ex.Message}", ex);
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

            // Lấy ngày tiêm tiếp theo
            var nextDoseDate = await CalculateNextDoseDateAsync(detail.VaccineId.Value, sequence);

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
                NextDoseDate = nextDoseDate,
				Price = detail.Vaccine.Price,
            };

            await _vaccineRecordRepository.AddAsync(vaccinationRecord);

            vaccineRecords.Add(new VaccineRecordDetailDTO
            {
                VaccineName = detail.Vaccine.Name,
                DoseAmount = detail.Vaccine.DoseAmount,
                Price = detail.Vaccine.Price,
                NextDoseDate = nextDoseDate,
                BatchNumber = vaccinationRecord.BatchNumber,
                StatusEnum = VaccineRecordStatus.Completed,
                Notes = "Đã tiêm chủng"
            });
        }

        public async Task<DateTime?> CalculateNextDoseDateAsync(int vaccineId, int sequence)
        {
            var injectionSchedule = await _unitOfWork.InjectionSchedules
                .GetAllAsync(schedule => schedule.VaccineScheduleDetail.VaccineId == vaccineId);

            // Kiểm tra nếu không có lịch tiêm nào
            if (injectionSchedule == null || !injectionSchedule.Any())
                return null;

            // Tìm mũi tiêm tiếp theo (doseNumber = sequence + 1)
            var nextInjection = injectionSchedule.FirstOrDefault(schedule => schedule.InjectionNumber == sequence + 1);

            return nextInjection != null ? DateTime.Now.AddMonths(nextInjection.InjectionMonth) : null;
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
            var isDoctorAssigned = await _unitOfWork.DoctorWorkSchedules
                .AnyAsync(dws => dws.BookingId == record.BookingDetail.BookingId && dws.UserId == userId);

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


        public async Task<bool> SoftDeleteVaccineRecordAsync(int vaccineRecordId, string doctorId)
		{
			if (vaccineRecordId <= 0)
				throw new ArgumentException("VaccineRecord ID không hợp lệ.");

			var record = await _vaccineRecordRepository.GetByIdAsync(
				vaccineRecordId,
				includeProperties: "BookingDetail.Booking"
			);

			if (record == null)
				throw new KeyNotFoundException("Không tìm thấy hồ sơ tiêm chủng.");

			// ✅ Kiểm tra quyền bác sĩ dựa trên `DoctorWorkSchedules`
			var isDoctorAssigned = await _unitOfWork.DoctorWorkSchedules
				.AnyAsync(dws => dws.BookingId == record.BookingDetail.BookingId && dws.UserId == doctorId);

			if (!isDoctorAssigned)
				throw new UnauthorizedAccessException("Bạn không có quyền xóa hồ sơ này.");

			if (record.Status == VaccineRecordStatus.Deleted)
				throw new InvalidOperationException("Hồ sơ này đã bị xóa trước đó.");

			record.Status = VaccineRecordStatus.Deleted;
			_vaccineRecordRepository.Update(record);
			await _unitOfWork.CompleteAsync();

			return true;
		}


		public async Task<IEnumerable<VaccineRecordDTO>> GetAllVaccineRecordsAsync(string doctorId)
		{
			var doctorBookings = await _unitOfWork.DoctorWorkSchedules
				.GetAllAsync(dws => dws.UserId == doctorId);

			var bookingIds = doctorBookings.Select(dws => dws.BookingId).ToList();

			var records = await _vaccineRecordRepository.GetAllAsync(
				vr => bookingIds.Contains(vr.BookingDetail.BookingId),
				includeProperties: "Vaccine,BookingDetail.Booking,Child"
			);

			if (records == null || !records.Any())
				throw new KeyNotFoundException("Không có hồ sơ tiêm chủng nào.");

			return records
				.GroupBy(record => record.BookingDetail.BookingId) // ✅ Group theo BookingId
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



		public async Task<bool> UpdateVaccineRecordAsync(int vaccineRecordId, UpdateVaccineRecordDTO updateDto, string doctorId)
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

			// ✅ Kiểm tra xem bác sĩ có quyền cập nhật lịch này không
			var isDoctorAssigned = await _unitOfWork.DoctorWorkSchedules
				.AnyAsync(dws => dws.BookingId == record.BookingDetail.BookingId && dws.UserId == doctorId);

			if (!isDoctorAssigned)
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

            bool isDoctorAssigned = await _unitOfWork.DoctorWorkSchedules
                .AnyAsync(dws => dws.BookingId == bookingId && dws.UserId == userId);

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

    }
}
