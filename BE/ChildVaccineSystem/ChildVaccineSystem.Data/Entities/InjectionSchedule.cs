using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
	public class InjectionSchedule
	{
		[Key]
		public int InjectionScheduleId { get; set; }

		[ForeignKey("VaccineScheduleDetail")]
		public int VaccineScheduleDetailId { get; set; }
		public VaccineScheduleDetail VaccineScheduleDetail { get; set; }

		[Required]
		[Range(1, int.MaxValue)]
		public int InjectionNumber { get; set; }

		[Required]
		[Range(0, int.MaxValue)]
		public int InjectionMonth { get; set; }

		public bool IsRequired { get; set; }

		public string Notes { get; set; }
	}
}
