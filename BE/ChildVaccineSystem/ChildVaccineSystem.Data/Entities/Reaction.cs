using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class Reaction
    {
        [Key]
        public int ReactionId { get; set; }

        [ForeignKey("VaccinationRecord")]
        public int VaccinationRecordId { get; set; }
        public VaccinationRecord VaccinationRecord { get; set; }

        [ForeignKey("Vaccine")]
        public int VaccineId { get; set; }
        public Vaccine Vaccine { get; set; }

        public string Description { get; set; }
    }


}
