using AutoMapper;
using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
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
			if (scheduleDto.AgeRangeEnd <= scheduleDto.AgeRangeStart)
			{
				throw new ArgumentException("Age range end must be greater than age range start");
			}

			var totalInjections = scheduleDto.VaccineScheduleDetails.Sum(v => v.InjectionSchedules.Count);


			var existingVaccines = await _unitOfWork.Vaccines.GetAllAsync();
			var requestedVaccineIds = scheduleDto.VaccineScheduleDetails.Select(v => v.VaccineId).ToList();
			var invalidVaccineIds = requestedVaccineIds.Except(existingVaccines.Select(v => v.VaccineId)).ToList();


			if (invalidVaccineIds.Any())
			{
				throw new ArgumentException($"Invalid vaccine IDs: {string.Join(", ", invalidVaccineIds)}");
			}

			foreach (var detail in scheduleDto.VaccineScheduleDetails)
			{
				var vaccine = existingVaccines.First(v => v.VaccineId == detail.VaccineId);
				if (detail.InjectionSchedules.Count != vaccine.InjectionsCount)
				{
					throw new ArgumentException(
						$"Number of injections for vaccine {vaccine.Name} ({detail.InjectionSchedules.Count}) " +
						$"does not match required count ({vaccine.InjectionsCount})");
				}
			}

			foreach (var detail in scheduleDto.VaccineScheduleDetails)
			{
				foreach (var injection in detail.InjectionSchedules)
				{
					if (injection.InjectionMonth < scheduleDto.AgeRangeStart ||
						injection.InjectionMonth > scheduleDto.AgeRangeEnd)
					{
						var vaccine = existingVaccines.First(v => v.VaccineId == detail.VaccineId);
						throw new ArgumentException(
							$"Injection month {injection.InjectionMonth} for vaccine {vaccine.Name} " +
							$"is outside schedule age range ({scheduleDto.AgeRangeStart}-{scheduleDto.AgeRangeEnd} months)");
					}
				}
			}

			using var transaction = await _unitOfWork.BeginTransactionAsync();
			try
			{
				var schedule = _mapper.Map<VaccinationSchedule>(scheduleDto);
				var createdSchedule = await _unitOfWork.VaccinationSchedules.AddAsync(schedule);
				await _unitOfWork.CompleteAsync();

				foreach (var detailDto in scheduleDto.VaccineScheduleDetails)
				{
					var detail = new VaccineScheduleDetail
					{
						ScheduleId = createdSchedule.ScheduleId,
						VaccineId = detailDto.VaccineId
					};

					await _unitOfWork.VaccineScheduleDetails.AddAsync(detail);
					await _unitOfWork.CompleteAsync();


					foreach (var injectionDto in detailDto.InjectionSchedules.OrderBy(i => i.DoseNumber))
					{
						var injection = _mapper.Map<InjectionSchedule>(injectionDto);
						injection.VaccineScheduleDetailId = detail.VaccineScheduleDetailId;

						await _unitOfWork.InjectionSchedules.AddAsync(injection);
					}
				}

				await _unitOfWork.CompleteAsync();
				await transaction.CommitAsync();

				return await GetScheduleByIdAsync(createdSchedule.ScheduleId);
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
				throw new ArgumentException($"Schedule with ID {id} not found");
			}


			if (scheduleDto.AgeRangeEnd <= scheduleDto.AgeRangeStart)
			{
				throw new ArgumentException("Age range end must be greater than age range start");
			}

			var existingVaccines = await _unitOfWork.Vaccines.GetAllAsync();
			var requestedVaccineIds = scheduleDto.VaccineScheduleDetails.Select(v => v.VaccineId).ToList();
			var invalidVaccineIds = requestedVaccineIds.Except(existingVaccines.Select(v => v.VaccineId)).ToList();


			if (invalidVaccineIds.Any())
			{
				throw new ArgumentException($"Invalid vaccine IDs: {string.Join(", ", invalidVaccineIds)}");
			}

			foreach (var detail in scheduleDto.VaccineScheduleDetails)
			{
				var vaccine = existingVaccines.First(v => v.VaccineId == detail.VaccineId);
				if (detail.InjectionSchedules.Count != vaccine.InjectionsCount)
				{
					throw new ArgumentException(
						$"Number of injections for vaccine {vaccine.Name} ({detail.InjectionSchedules.Count}) " +
						$"does not match required count ({vaccine.InjectionsCount})");
				}
			}

			foreach (var detail in scheduleDto.VaccineScheduleDetails)
			{
				foreach (var injection in detail.InjectionSchedules)
				{
					if (injection.InjectionMonth < scheduleDto.AgeRangeStart ||
						injection.InjectionMonth > scheduleDto.AgeRangeEnd)
					{
						var vaccine = existingVaccines.First(v => v.VaccineId == detail.VaccineId);
						throw new ArgumentException(
							$"Injection month {injection.InjectionMonth} for vaccine {vaccine.Name} " +
							$"is outside schedule age range ({scheduleDto.AgeRangeStart}-{scheduleDto.AgeRangeEnd} months)");
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
							DoseNumber = injectionDto.DoseNumber,
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
	}
}
