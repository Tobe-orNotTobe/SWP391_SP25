using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class BookingDetail
    {
        [Key]
        public int BookingDetailId { get; set; }

        [ForeignKey("Booking")]
        public int BookingId { get; set; }
        public Booking Booking { get; set; } 
        [ForeignKey("Vaccine")]
        public int? VaccineId { get; set; } 
        public Vaccine Vaccine { get; set; }

        [ForeignKey("ComboVaccine")]
        public int? ComboId { get; set; }  
        public ComboVaccine ComboVaccine { get; set; }

        [ForeignKey("Children")]
        public int ChildId { get; set; }
        public Children Children { get; set; }

        public DateTime InjectionDate { get; set; }
    }

}
