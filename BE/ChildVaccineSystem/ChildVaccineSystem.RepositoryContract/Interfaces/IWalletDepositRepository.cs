using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface IWalletDepositRepository : IRepository<WalletDeposit>
	{
		Task<List<WalletDeposit>> GetUserDepositsAsync(string userId);
		Task UpdateStatusAsync(int id, string status, string responseCode);
	}
}
