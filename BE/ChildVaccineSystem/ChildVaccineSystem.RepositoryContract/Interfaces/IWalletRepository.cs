using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface IWalletRepository : IRepository<Wallet>
	{
		Task<Wallet> GetWalletByUserIdAsync(string userId);
		Task<Wallet> GetAdminWalletAsync();
		Task<Wallet> CreateWalletAsync(string userId, bool isAdminWallet = false);
		Task<Wallet> CreateAdminWalletAsync(string userId);
		Task<List<WalletTransaction>> GetWalletTransactionsAsync(int walletId, int count = 10);
		Task<WalletTransaction> AddTransactionAsync(WalletTransaction transaction);
		Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount);
		Task<bool> UpdateWalletBalanceByRefundAsync(int walletId, decimal amountRefund);
	}
}