using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; } 
        public User User { get; set; }

        public string? ServicePackageId { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }

        [ForeignKey("PricingPolicy")]
        public int PricingPolicyId { get; set; }
        public PricingPolicy PricingPolicy { get; set; }
        public ICollection<BookingDetail> BookingDetails { get; set; }

    }
}
