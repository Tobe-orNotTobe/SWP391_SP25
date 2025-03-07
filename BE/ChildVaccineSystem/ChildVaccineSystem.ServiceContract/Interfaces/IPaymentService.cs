using ChildVaccineSystem.Data.DTO.Payment;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IPaymentService
	{
		Task<WalletPaymentResponseDTO> ProcessWalletPaymentAsync(string userId, int bookingId);
	}
}