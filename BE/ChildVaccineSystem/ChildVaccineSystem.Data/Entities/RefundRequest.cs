using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
	public class RefundRequest
	{
		[Key]
		public int RefundRequestId { get; set; }

		[ForeignKey("Booking")]
		public int BookingId { get; set; }
		public Booking Booking { get; set; }

		[ForeignKey("User")]
		public string UserId { get; set; }
		public User User { get; set; }

		public string Reason { get; set; }

		[Column(TypeName = "decimal(18,2)")]
		public decimal Amount { get; set; }

		public string Status { get; set; } // Pending, Approved, Rejected

		public string? AdminNote { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? ProcessedAt { get; set; }

	}
}
