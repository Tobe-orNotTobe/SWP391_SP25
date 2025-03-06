using ChildVaccineSystem.Data.DTO.Wallet;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IWalletDepositService
	{
		Task<WalletDepositResponseDTO> CreateDepositAsync(string userId, WalletDepositDTO depositDto, string ipAddress);
		Task<bool> ProcessDepositAsync(int depositId, string responseCode);
		Task<List<WalletDepositDTO>> GetUserDepositsAsync(string userId);
	}
}
