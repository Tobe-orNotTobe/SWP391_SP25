using ChildVaccineSystem.Data.DTO.Payment;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IPaymentService
	{
		Task<WalletPaymentResponseDTO> ProcessWalletPaymentAsync(string userId, WalletPaymentDTO paymentDto);
	}
}