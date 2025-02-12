using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccinationSchedule
{
	public class CreateVaccinationScheduleDTO
	{
		[Required]
		[Range(0, int.MaxValue, ErrorMessage = "Age range start must be a non-negative number")]
		public int AgeRangeStart { get; set; }

		[Required]
		[Range(0, int.MaxValue, ErrorMessage = "Age range end must be a non-negative number")]
		public int AgeRangeEnd { get; set; }

		[Required]
		[Range(1, int.MaxValue, ErrorMessage = "Recommended dose must be at least 1")]
		public int RecommendedDose { get; set; }

		public string Notes { get; set; }
	}
}
