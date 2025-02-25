using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class ComboDetail
    {
        [Key]
        public int ComboDetailId { get; set; }

        [ForeignKey("ComboVaccine")]
        public int ComboId { get; set; }
        public ComboVaccine ComboVaccine { get; set; }

        [ForeignKey("Vaccine")]
        public int VaccineId { get; set; }
        public Vaccine Vaccine { get; set; }
    }
}
