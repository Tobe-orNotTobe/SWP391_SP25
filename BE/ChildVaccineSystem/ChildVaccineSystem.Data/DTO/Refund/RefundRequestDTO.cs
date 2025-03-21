using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.DTO.Refund
{
	public class RefundRequestDTO
	{
		public int RefundRequestId { get; set; }
		public int BookingId { get; set; }
		public string UserId { get; set; }
		public string UserName { get; set; }
		public decimal Amount { get; set; }
		public string Reason { get; set; }
		public string Status { get; set; }
		public string AdminNote { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? ProcessedAt { get; set; }
	}

	public class CreateRefundRequestDTO
	{
		[Required]
		public int BookingId { get; set; }

		[Required]
		[StringLength(500, MinimumLength = 10, ErrorMessage = "Reason must be between 10 and 500 characters")]
		public string Reason { get; set; }
	}

	public class ProcessRefundRequestDTO
	{
		[Required]
		[StringLength(500, ErrorMessage = "Admin note cannot exceed 500 characters")]
		public string AdminNote { get; set; }
	}
}
