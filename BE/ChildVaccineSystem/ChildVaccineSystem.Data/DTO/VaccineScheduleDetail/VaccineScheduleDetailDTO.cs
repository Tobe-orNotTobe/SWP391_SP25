using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineScheduleDetail
{
	public class VaccineScheduleDetailDTO
	{
		public int VaccineId { get; set; }
		public string VaccineName { get; set; }
		public List<InjectionScheduleDTO> InjectionSchedules { get; set; } = new List<InjectionScheduleDTO>();
	}
}
