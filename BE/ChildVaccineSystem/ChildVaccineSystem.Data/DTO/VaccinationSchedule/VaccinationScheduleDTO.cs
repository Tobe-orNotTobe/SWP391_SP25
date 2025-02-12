using ChildVaccineSystem.Data.DTO.ComboVaccine;
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
		public int RecommendedDose { get; set; }
		public string Notes { get; set; }
		public List<ComboVaccineDTO>? ComboVaccines { get; set; }
	}
}

