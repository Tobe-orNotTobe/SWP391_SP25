using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Transaction
{
	public class CreateTransactionDTO
	{
		public int BookingId { get; set; }
		public string UserId { get; set; }
		public string PaymentMethod { get; set; }
		public decimal Amount { get; set; }
	}
}
