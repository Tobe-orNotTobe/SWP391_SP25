using AutoMapper;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Data.DTO.VaccineScheduleDetail;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
	public class VaccinationScheduleService : IVaccinationScheduleService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;

		public VaccinationScheduleService(IUnitOfWork unitOfWork, IMapper mapper)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		public async Task<List<VaccinationScheduleDTO>> GetAllSchedulesAsync()
		{
			var schedules = await _unitOfWork.VaccinationSchedules.GetAllAsync(includeProperties: "VaccineScheduleDetails.Vaccine,VaccineScheduleDetails.InjectionSchedules");
			return _mapper.Map<List<VaccinationScheduleDTO>>(schedules);
		}

		public async Task<VaccinationScheduleDTO> GetScheduleByIdAsync(int id)
		{
			var schedule = await _unitOfWork.VaccinationSchedules.GetAsync(v => v.ScheduleId == id, includeProperties: "VaccineScheduleDetails.Vaccine,VaccineScheduleDetails.InjectionSchedules");

			return _mapper.Map<VaccinationScheduleDTO>(schedule);
		}

		public async Task<VaccinationScheduleDTO> CreateScheduleAsync(CreateVaccinationScheduleDTO scheduleDto)
		{

			var conflictSchedule = await _unitOfWork.VaccinationSchedules.GetAsync(vs =>
				vs.AgeRangeStart == scheduleDto.AgeRangeStart || vs.AgeRangeEnd == scheduleDto.AgeRangeEnd);
			if (conflictSchedule != null)
			{
				throw new InvalidOperationException("Đã có lịch tiêm chủng này trong hệ thống!");
			}

			// Validate age range
			if (scheduleDto.AgeRangeEnd <= scheduleDto.AgeRangeStart)
			{
				throw new ArgumentException("Độ tuổi kết thúc phải lớn hơn độ tuổi bắt đầu!");
			}

			// Validate duplicate vaccines
			var uniqueVaccineIds = scheduleDto.VaccineScheduleDetails.Select(vs => vs.VaccineId).Distinct().ToList();
			if (uniqueVaccineIds.Count != scheduleDto.VaccineScheduleDetails.Count)
			{
				throw new InvalidOperationException("Không được phép trùng vắc-xin trong lịch tiêm chủng này!");
			}

			using var transaction = await _unitOfWork.BeginTransactionAsync();
			try
			{
				var schedule = new VaccinationSchedule
				{
					AgeRangeStart = scheduleDto.AgeRangeStart,
					AgeRangeEnd = scheduleDto.AgeRangeEnd,
					Notes = scheduleDto.Notes ?? string.Empty
				};

				var createdSchedule = await _unitOfWork.VaccinationSchedules.AddAsync(schedule);
				await _unitOfWork.CompleteAsync();

				var resultDTO = new VaccinationScheduleDTO
				{
					ScheduleId = createdSchedule.ScheduleId,
					AgeRangeStart = createdSchedule.AgeRangeStart,
					AgeRangeEnd = createdSchedule.AgeRangeEnd,
					Notes = createdSchedule.Notes,
					VaccineScheduleDetails = new List<VaccineScheduleDetailDTO>()
				};

				foreach (var vaccineDetail in scheduleDto.VaccineScheduleDetails)
				{
					var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == vaccineDetail.VaccineId);
					if (vaccine == null)
					{
						throw new KeyNotFoundException($"Không tìm thấy vắc-xin ID {vaccineDetail.VaccineId}!");
					}

					var vaccineScheduleDetail = new VaccineScheduleDetail
					{
						ScheduleId = createdSchedule.ScheduleId,
						VaccineId = vaccineDetail.VaccineId
					};

					var createdVaccineDetail = await _unitOfWork.VaccineScheduleDetails.AddAsync(vaccineScheduleDetail);
					await _unitOfWork.CompleteAsync();

					var vaccineDetailDTO = new VaccineScheduleDetailDTO
					{
						VaccineId = createdVaccineDetail.VaccineId,
						VaccineName = vaccine.Name,
						InjectionSchedules = new List<InjectionScheduleDTO>()
					};

					var injectionMonths = vaccineDetail.InjectionSchedules.Select(x => x.InjectionNumber).ToList();

					if (injectionMonths.Distinct().Count() != injectionMonths.Count)
					{
						throw new InvalidOperationException($"Bị trùng lặp số mũi của vắc-xin ID {vaccineDetail.VaccineId}!");
					}

					foreach (var injection in vaccineDetail.InjectionSchedules)
					{
						if (injection.InjectionMonth < scheduleDto.AgeRangeStart * 12 ||
							injection.InjectionMonth > scheduleDto.AgeRangeEnd * 12)
						{
							throw new ArgumentException(
								$"Mũi tháng {injection.InjectionMonth} của vắc-xin ID {vaccineDetail.VaccineId} đã nằm ngoài độ tuổi {scheduleDto.AgeRangeStart} ({scheduleDto.AgeRangeStart * 12} tháng) " +
								$"- {scheduleDto.AgeRangeEnd} ({scheduleDto.AgeRangeStart * 12} tháng)!"
							);
						}

						var injectionSchedule = new InjectionSchedule
						{
							VaccineScheduleDetailId = createdVaccineDetail.VaccineScheduleDetailId,
							InjectionNumber = injection.InjectionNumber,
							InjectionMonth = injection.InjectionMonth,
							IsRequired = injection.IsRequired,
							Notes = injection.Notes ?? string.Empty
						};

						var createdInjection = await _unitOfWork.InjectionSchedules.AddAsync(injectionSchedule);

						var injectionDTO = new InjectionScheduleDTO
						{
							InjectionNumber = createdInjection.InjectionNumber,
							InjectionMonth = createdInjection.InjectionMonth,
							IsRequired = createdInjection.IsRequired,
							Notes = createdInjection.Notes
						};

						vaccineDetailDTO.InjectionSchedules.Add(injectionDTO);
					}

					resultDTO.VaccineScheduleDetails.Add(vaccineDetailDTO);
				}

				await _unitOfWork.CompleteAsync();
				await transaction.CommitAsync();

				return resultDTO;
			}
			catch (Exception)
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		public async Task<VaccinationScheduleDTO> UpdateScheduleAsync(int id, UpdateVaccinationScheduleDTO scheduleDto)
		{
			var existingSchedule = await _unitOfWork.VaccinationSchedules.GetAsync(v => v.ScheduleId == id, includeProperties: "VaccineScheduleDetails.InjectionSchedules");

			if (existingSchedule == null)
			{
				throw new KeyNotFoundException($"Không tìm thấy lịch tiêm chủng!");
			}


			if (scheduleDto.AgeRangeEnd <= scheduleDto.AgeRangeStart)
			{
				throw new ArgumentException("Độ tuổi kết thúc phải lớn hơn độ tuổi bắt đầu!");
			}

			var existingVaccines = await _unitOfWork.Vaccines.GetAllAsync();

			var requestedVaccineIds = scheduleDto.VaccineScheduleDetails.Select(v => v.VaccineId).ToList();

			var invalidVaccineIds = requestedVaccineIds.Except(existingVaccines.Select(v => v.VaccineId)).ToList();

			var duplicateVaccineIds = requestedVaccineIds.GroupBy(id => id)
				.Where(g => g.Count() > 1)
				.Select(g => g.Key)
				.ToList();

			if (duplicateVaccineIds.Any())
			{
				throw new InvalidOperationException($"Không được phép trùng vắc-xin trong lịch tiêm chủng này!");
			}

			if (invalidVaccineIds.Any())
			{
				throw new KeyNotFoundException($"IDs vắc-xin không tìm thấy: {string.Join(", ", invalidVaccineIds)}");
			}



			foreach (var detail in scheduleDto.VaccineScheduleDetails)
			{

				var injectionMonths = detail.InjectionSchedules.Select(x => x.InjectionNumber).ToList();
				if (injectionMonths.Distinct().Count() != injectionMonths.Count)
				{
					throw new InvalidOperationException($"Bị trùng lặp số mũi của vắc-xin ID {detail.VaccineId}!");
				}

				foreach (var injection in detail.InjectionSchedules)
				{
					if (injection.InjectionMonth < scheduleDto.AgeRangeStart * 12 ||
						injection.InjectionMonth > scheduleDto.AgeRangeEnd * 12)
					{
						var vaccine = existingVaccines.First(v => v.VaccineId == detail.VaccineId);
						throw new ArgumentException(
							$"Mũi ở tháng {injection.InjectionMonth} của vắc-xin {vaccine.VaccineId} " +
							$"đã nằm ngoài độ tuổi {scheduleDto.AgeRangeStart} ({scheduleDto.AgeRangeStart * 12} tháng) - {scheduleDto.AgeRangeEnd} ({scheduleDto.AgeRangeEnd * 12} tháng)");
					}
				}
			}

			using var transaction = await _unitOfWork.BeginTransactionAsync();
			try
			{
				existingSchedule.AgeRangeStart = scheduleDto.AgeRangeStart;
				existingSchedule.AgeRangeEnd = scheduleDto.AgeRangeEnd;
				existingSchedule.Notes = scheduleDto.Notes;

				var currentDetails = await _unitOfWork.VaccineScheduleDetails
					.GetAllAsync(vd => vd.ScheduleId == id);

				// First, remove all injection schedules
				foreach (var detail in currentDetails)
				{
					var injections = await _unitOfWork.InjectionSchedules
						.GetAllAsync(i => i.VaccineScheduleDetailId == detail.VaccineScheduleDetailId);

					foreach (var injection in injections)
					{
						await _unitOfWork.InjectionSchedules.DeleteAsync(injection);
					}
				}
				await _unitOfWork.CompleteAsync();

				// Then, remove all vaccine schedule details
				foreach (var detail in currentDetails)
				{
					await _unitOfWork.VaccineScheduleDetails.DeleteAsync(detail);
				}
				await _unitOfWork.CompleteAsync();

				// Now add new vaccine schedule details and injections
				foreach (var detailDto in scheduleDto.VaccineScheduleDetails)
				{
					var newDetail = new VaccineScheduleDetail
					{
						ScheduleId = id,
						VaccineId = detailDto.VaccineId
					};

					var addedDetail = await _unitOfWork.VaccineScheduleDetails.AddAsync(newDetail);
					await _unitOfWork.CompleteAsync();

					// Add injection schedules
					foreach (var injectionDto in detailDto.InjectionSchedules)
					{
						var injection = new InjectionSchedule
						{
							VaccineScheduleDetailId = addedDetail.VaccineScheduleDetailId,
							InjectionNumber = injectionDto.InjectionNumber,
							InjectionMonth = injectionDto.InjectionMonth,
							Notes = injectionDto.Notes
						};
						await _unitOfWork.InjectionSchedules.AddAsync(injection);
					}
				}

				await _unitOfWork.CompleteAsync();
				await transaction.CommitAsync();

				return await GetScheduleByIdAsync(id);
			}
			catch (Exception)
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		public async Task<bool> DeleteScheduleAsync(int id)
		{
			var existingSchedule = await _unitOfWork.VaccinationSchedules.GetAsync(
				v => v.ScheduleId == id,
				includeProperties: "VaccineScheduleDetails.InjectionSchedules"
			);

			if (existingSchedule == null) return false;

			using var transaction = await _unitOfWork.BeginTransactionAsync();
			try
			{
				foreach (var detail in existingSchedule.VaccineScheduleDetails)
				{
					foreach (var injection in detail.InjectionSchedules)
					{
						await _unitOfWork.InjectionSchedules.DeleteAsync(injection);
					}
					await _unitOfWork.VaccineScheduleDetails.DeleteAsync(detail);
				}

				await _unitOfWork.VaccinationSchedules.DeleteAsync(existingSchedule);
				await _unitOfWork.CompleteAsync();
				await transaction.CommitAsync();

				return true;
			}
			catch
			{
				await transaction.RollbackAsync();
				return false;
			}
		}
		public async Task<ScheduleByAgeResponseDTO> GetScheduleByChildrenAgeAsync(int childrenId)
		{
			var children = await _unitOfWork.Children.GetAsync(c => c.ChildId == childrenId);
			if (children == null)
				throw new KeyNotFoundException($"Không tìm thấy ID trẻ: {childrenId}");

			var today = DateTime.Today;
			int age = (today - children.DateOfBirth).Days / 365;
			if (today < children.DateOfBirth.AddYears(age))
				age--;

			var schedules = await _unitOfWork.VaccinationSchedules.GetAllAsync(
				s => s.AgeRangeStart <= age && s.AgeRangeEnd > age,
				includeProperties: "VaccineScheduleDetails.Vaccine"
			);

			if (schedules.Count() == 0)
				throw new KeyNotFoundException($"Không tìm thấy lịch phù hợp cho trẻ này!");

			var schedule = schedules.FirstOrDefault();

			var response = new ScheduleByAgeResponseDTO();

			var vaccineIds = schedule.VaccineScheduleDetails.Select(vsd => vsd.VaccineId).ToList();
			var vaccines = await _unitOfWork.Vaccines.GetAllAsync(
				v => vaccineIds.Contains(v.VaccineId) && v.Status == true
			);

			response.Vaccines = _mapper.Map<List<VaccineDTO>>(vaccines);

			var allCombos = await _unitOfWork.ComboVaccines.GetAllAsync(
				c => c.IsActive,
				includeProperties: "ComboDetails.Vaccine"
			);

			var eligibleVaccineIds = vaccines.Select(v => v.VaccineId).ToList();
			var eligibleCombos = new List<ComboVaccine>();

			foreach (var combo in allCombos)
			{
				var vaccineIdsInCombo = combo.ComboDetails.Select(cd => cd.VaccineId).ToList();

				if (vaccineIdsInCombo.Intersect(eligibleVaccineIds).Any())
				{
					eligibleCombos.Add(combo);
				}
			}

			response.ComboVaccines = _mapper.Map<List<ComboVaccineDTO>>(eligibleCombos);

			return response;
		}
	}
}
