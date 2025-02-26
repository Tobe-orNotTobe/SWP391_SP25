using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Transaction
{
	public class TransactionDTO
	{
		public int TransactionId { get; set; }
		public int BookingId { get; set; }
		public string UserId { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? UpdatedAt { get; set; }
		public string PaymentMethod { get; set; }
		public string Status { get; set; }
		public string ResponseCode { get; set; }
		public decimal Amount { get; set; }
		public string TransactionRef { get; set; }
	}
}
