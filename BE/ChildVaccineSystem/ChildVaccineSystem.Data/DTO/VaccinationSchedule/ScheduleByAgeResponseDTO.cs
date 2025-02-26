using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.Vaccine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccinationSchedule
{
	public class ScheduleByAgeResponseDTO
	{
		public List<VaccineDTO> Vaccines { get; set; } = new List<VaccineDTO>();

		public List<ComboVaccineDTO> ComboVaccines { get; set; } = new List<ComboVaccineDTO>();

	}
}
