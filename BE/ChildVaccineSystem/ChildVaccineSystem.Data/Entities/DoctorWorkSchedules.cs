using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class DoctorWorkSchedule
    {
        [Key]
        public int DoctorWorkScheduleId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        [ForeignKey("Booking")]
        public int BookingId { get; set; }
        public Booking Booking { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
    }
}