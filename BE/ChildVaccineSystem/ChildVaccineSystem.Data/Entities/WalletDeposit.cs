using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
	public class WalletDeposit
	{
		[Key]
		public int DepositId { get; set; }

		[ForeignKey("User")]
		public string UserId { get; set; }
		public User User { get; set; }

		[Column(TypeName = "decimal(18,2)")]
		public decimal Amount { get; set; }

		public string Status { get; set; } = "Pending";

		public string PaymentMethod { get; set; } = "VnPay";

		public string? TransactionRef { get; set; }

		public string? ResponseCode { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public DateTime? ProcessedAt { get; set; }
	}
}
