using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
	public class VaccineScheduleDetail
	{
		[Key]
		public int VaccineScheduleDetailId { get; set; }

		[ForeignKey("VaccinationSchedule")]
		public int ScheduleId { get; set; }
		public VaccinationSchedule Schedule { get; set; }

		[ForeignKey("Vaccine")]
		public int VaccineId { get; set; }
		public Vaccine Vaccine { get; set; }

		public virtual ICollection<InjectionSchedule> InjectionSchedules { get; set; }
	}
}
