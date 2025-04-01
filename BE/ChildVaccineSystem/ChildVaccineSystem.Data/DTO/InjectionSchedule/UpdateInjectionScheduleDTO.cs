using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.InjectionSchedule
{
	public class UpdateInjectionScheduleDTO
	{
		[Required]
		[Range(1, int.MaxValue, ErrorMessage = "Injection number must be positive")]
		public int InjectionNumber { get; set; }

		[Required]
		[Range(0, int.MaxValue, ErrorMessage = "Injection month must be non-negative")]
		public int InjectionMonth { get; set; }
		[Required]
		public bool IsRequired { get; set; }
		public string Notes { get; set; }
	}
}
