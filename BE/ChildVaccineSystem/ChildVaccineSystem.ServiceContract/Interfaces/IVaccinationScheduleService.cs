using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IVaccinationScheduleService
	{
		Task<List<VaccinationScheduleDTO>> GetAllSchedulesAsync();
		Task<VaccinationScheduleDTO> GetScheduleByIdAsync(int id);
		Task<VaccinationScheduleDTO> CreateScheduleAsync(CreateVaccinationScheduleDTO scheduleDto);
		Task<VaccinationScheduleDTO> UpdateScheduleAsync(int id, UpdateVaccinationScheduleDTO scheduleDto);
		Task<bool> DeleteScheduleAsync(int id);
		Task<ScheduleByAgeResponseDTO> GetScheduleByChildrenAgeAsync(int childrenId);

	}
}
