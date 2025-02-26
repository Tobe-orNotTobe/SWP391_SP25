using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [ForeignKey("Booking")]
        public int BookingId { get; set; }
        public Booking Booking { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; } 
        public User User { get; set; }

        public DateTime CreatedAt { get; set; }

		public DateTime? UpdatedAt { get; set; }

		[Required]
		public string PaymentMethod { get; set; }

		[Required]
		public string Status { get; set; }

		[Column(TypeName = "decimal(18,2)")]
		public decimal Amount { get; set; }
	}


}
