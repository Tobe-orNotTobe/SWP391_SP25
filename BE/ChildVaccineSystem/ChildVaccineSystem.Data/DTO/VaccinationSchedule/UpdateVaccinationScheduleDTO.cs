using ChildVaccineSystem.Data.DTO.VaccineScheduleDetail;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccinationSchedule
{
	public class UpdateVaccinationScheduleDTO
	{
		[Range(0, int.MaxValue, ErrorMessage = "Age range start must be a non-negative number")]
		public int AgeRangeStart { get; set; }

		[Range(0, int.MaxValue, ErrorMessage = "Age range end must be a non-negative number")]
		public int AgeRangeEnd { get; set; }

		public string? Notes { get; set; }

		[Required(ErrorMessage = "At least one vaccine schedule is required")]
		public List<UpdateVaccineScheduleDetailDTO> VaccineScheduleDetails { get; set; } = new List<UpdateVaccineScheduleDetailDTO>();
	}
}
