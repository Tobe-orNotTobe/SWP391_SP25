using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Booking
{
    public class CreateBookingDTO
    {
        [Required]
        public int ChildId { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        public string? Notes { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one booking detail is required")]
        public List<CreateBookingDetailDTO> BookingDetails { get; set; } = new();
    }

}
