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
				var schedules = await _unitOfWork.VaccinationSchedules.GetAllAsync(includeProperties: "ComboVaccines,ComboVaccines.ComboDetails,ComboVaccines.ComboDetails.Vaccine"
);
				return _mapper.Map<List<VaccinationScheduleDTO>>(schedules);
			}

		public async Task<VaccinationScheduleDTO> GetScheduleByIdAsync(int id)
		{
			var schedule = await _unitOfWork.VaccinationSchedules.GetAsync(v => v.ScheduleId == id, includeProperties: "ComboVaccines,ComboVaccines.ComboDetails,ComboVaccines.ComboDetails.Vaccine");

			return _mapper.Map<VaccinationScheduleDTO>(schedule);
		}

		public async Task<VaccinationScheduleDTO> CreateScheduleAsync(CreateVaccinationScheduleDTO scheduleDto)
		{
			var schedule = _mapper.Map<VaccinationSchedule>(scheduleDto);
			var createdSchedule = await _unitOfWork.VaccinationSchedules.AddAsync(schedule);
			await _unitOfWork.CompleteAsync();
			return _mapper.Map<VaccinationScheduleDTO>(createdSchedule);
		}

		public async Task<VaccinationScheduleDTO> UpdateScheduleAsync(int id, UpdateVaccinationScheduleDTO scheduleDto)
		{
			var existingSchedule = await _unitOfWork.VaccinationSchedules.GetAsync(v => v.ScheduleId == id);
			if (existingSchedule == null) return null;

			_mapper.Map(scheduleDto, existingSchedule);
			var updatedSchedule = await _unitOfWork.VaccinationSchedules.UpdateAsync(existingSchedule);
			await _unitOfWork.CompleteAsync();
			return _mapper.Map<VaccinationScheduleDTO>(updatedSchedule);
		}

		public async Task<bool> DeleteScheduleAsync(int id)
		{
			var existingSchedule = await _unitOfWork.VaccinationSchedules.GetAsync(
				v => v.ScheduleId == id,
				includeProperties: "ComboVaccines,ComboVaccines.ComboDetails,ComboVaccines.ComboDetails.Vaccine"
			);

			if (existingSchedule == null) return false;

			// Update related Vaccines to set ScheduleId to null
			var relatedVaccines = await _unitOfWork.Vaccines.GetAllAsync(v => v.ScheduleId == id);

			foreach (var vaccine in relatedVaccines)
			{
				vaccine.ScheduleId = null;
				await _unitOfWork.Vaccines.UpdateAsync(vaccine);
			}

			// Update related ComboVaccines to set ScheduleId to null
			var relatedCombos = await _unitOfWork.ComboVaccines.GetAllAsync(c => c.ScheduleId == id);

			if (relatedCombos != null && relatedCombos.Any())
			{
				foreach (var combo in relatedCombos)
				{
					combo.ScheduleId = null;
					await _unitOfWork.ComboVaccines.UpdateAsync(combo);
				}
			}

			if (existingSchedule == null) return false;

			await _unitOfWork.VaccinationSchedules.DeleteAsync(existingSchedule);
			await _unitOfWork.CompleteAsync();
			return true;
		}
	}
}
