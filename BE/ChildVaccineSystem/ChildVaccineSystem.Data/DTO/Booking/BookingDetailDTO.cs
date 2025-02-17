using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Booking
{
    public class BookingDetailDTO
    {
        public int BookingDetailId { get; set; }
        public int BookingId { get; set; }
        public int? VaccineId { get; set; }
        public int? ComboId { get; set; }
        public int ChildId { get; set; }
        public DateTime InjectionDate { get; set; }
    }

}
