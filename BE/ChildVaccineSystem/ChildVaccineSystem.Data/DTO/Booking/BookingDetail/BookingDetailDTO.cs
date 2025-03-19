using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Booking.BookingDetail
{
    public class BookingDetailDTO
    {
        public int BookingDetailId { get; set; } // ✅ Thay vì BookingId, dùng BookingDetailId
        public int? VaccineId { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public decimal Price { get; set; }
        public int? ComboVaccineId { get; set; }
        public string? ComboVaccineName { get; set; } = string.Empty;
    }

}
