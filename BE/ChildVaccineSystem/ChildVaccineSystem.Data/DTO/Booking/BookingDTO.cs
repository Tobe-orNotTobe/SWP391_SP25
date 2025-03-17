using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;
using ChildVaccineSystem.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Booking
{
    public class BookingDTO
    {
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public int ChildId { get; set; }
        public string ChildName { get; set; }
        public BookingType BookingType { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public int? DoctorWorkScheduleId { get; set; } 
        public List<BookingDetailDTO> BookingDetails { get; set; }
    }
}
