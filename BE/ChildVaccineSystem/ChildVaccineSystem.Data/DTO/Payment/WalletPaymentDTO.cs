using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.DTO.Payment
{
	public class WalletPaymentResponseDTO
	{
		public bool Success { get; set; }
		public string Message { get; set; }
		public int BookingId { get; set; }
		public decimal AmountPaid { get; set; }
		public decimal RemainingWalletBalance { get; set; }
		public DateTime PaymentDate { get; set; }
		public string TransactionId { get; set; }
	}
}