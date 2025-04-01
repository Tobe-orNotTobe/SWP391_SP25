using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.DTO.Wallet
{
	public class WalletDTO
	{
		public int WalletId { get; set; }
		public string UserId { get; set; }
		public decimal Balance { get; set; }
		public decimal TotalRefunded { get; set; }
		public bool IsAdminWallet { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? UpdatedAt { get; set; }
		public List<WalletTransactionDTO> RecentTransactions { get; set; }
	}

	public class WalletTransactionDTO
	{
		public int WalletTransactionId { get; set; }
		public int WalletId { get; set; }
		public decimal Amount { get; set; }
		public string TransactionType { get; set; }
		public string Description { get; set; }
		public string Status { get; set; }
		public DateTime CreatedAt { get; set; }
	}

	public class AddFundsDTO
	{
		[Required]
		[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
		public decimal Amount { get; set; }
	}
	public class WalletDepositDTO
	{
		[Required]
		[Range(10000, 100000000, ErrorMessage = "Deposit amount must be between 10,000 VND and 100,000,000 VND")]
		public decimal Amount { get; set; }
	}

	public class WalletDepositResponseDTO
	{
		public bool Success { get; set; }
		public string Message { get; set; }
		public string PaymentUrl { get; set; }
	}
}
