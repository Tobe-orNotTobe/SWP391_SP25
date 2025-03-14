using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.InjectionSchedule
{
	public class CreateInjectionScheduleDTO
	{
		[Required]
		[Range(1, int.MaxValue)]
		public int InjectionNumber { get; set; }

		[Required]
		[Range(0, int.MaxValue)]
		public int InjectionMonth { get; set; }
		[Required]
		public bool IsRequired { get; set; } = true;
		public string? Notes { get; set; }
	}
}
