using ChildVaccineSystem.Data.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        [ForeignKey("Children")]
        public int ChildId { get; set; }
        public Children Children { get; set; }

        [Required]
        public BookingType BookingType { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; }
        [Required]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        [ForeignKey("PricingPolicy")]
        public int? PricingPolicyId { get; set; }
        public PricingPolicy PricingPolicy { get; set; }

        public ICollection<BookingDetail> BookingDetails { get; set; }

        [ForeignKey("DoctorWorkSchedule")]
        public int? DoctorWorkScheduleId { get; set; }
        public DoctorWorkSchedule DoctorWorkSchedule { get; set; }

		public Feedback Feedback { get; set; }
        public RefundRequest RefundRequest { get; set; }
	}
}
