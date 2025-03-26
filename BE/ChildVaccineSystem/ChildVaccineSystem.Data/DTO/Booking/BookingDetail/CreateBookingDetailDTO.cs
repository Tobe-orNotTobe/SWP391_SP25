using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Booking.BookingDetail
{
    public class CreateBookingDetailDTO
    {
        public int? VaccineId { get; set; }

        public int? ComboVaccineId { get; set; }

        [Required(ErrorMessage = "Ngày tiêm không được để trống.")]
        public DateTime InjectionDate { get; set; } // ✅ Ngày tiêm riêng cho từng mũi

    }
}
