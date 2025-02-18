using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.VaccineScheduleDetail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccinationSchedule
{
	public class VaccinationScheduleDTO
	{
		public int ScheduleId { get; set; }
		public int AgeRangeStart { get; set; }
		public int AgeRangeEnd { get; set; }
		public string Notes { get; set; }

		public List<VaccineScheduleDetailDTO> VaccineScheduleDetails { get; set; } = new List<VaccineScheduleDetailDTO>();
	}
}

