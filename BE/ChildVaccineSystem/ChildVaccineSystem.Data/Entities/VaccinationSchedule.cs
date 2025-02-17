using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class VaccinationSchedule
    {
        [Key]
        public int ScheduleId { get; set; }
		[Required]
		[Range(0, int.MaxValue)]
		public int AgeRangeStart { get; set; }

		[Required]
		[Range(0, int.MaxValue)]
		public int AgeRangeEnd { get; set; }

        public string Notes { get; set; }

		public virtual ICollection<VaccineScheduleDetail> VaccineScheduleDetails { get; set; }
	}

}
