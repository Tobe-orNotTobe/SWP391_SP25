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
        public int AgeRangeStart { get; set; }
        public int AgeRangeEnd { get; set; }
        public int RecommendedDose { get; set; }
        public string Notes { get; set; }
    }

}
