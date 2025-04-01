using ChildVaccineSystem.Data.DTO.Wallet;
using Microsoft.EntityFrameworkCore.Storage;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IWalletService
	{
		Task<WalletDTO> GetUserWalletAsync(string userId);
		Task CreateWalletAsync(string userId, bool isAdminWallet = false);
		Task CreateAdminWalletAsync(string userId);
		Task<WalletDTO> AddFundsToAdminWalletAsync(AddFundsDTO addFundsDto);
		Task<string> CreateDepositAsync(string userId, WalletDepositDTO depositDto, string ipAddress);
		Task<bool> ProcessDepositAsync(int walletTransactionId, string responseCode);
		Task<bool> TransferFundsAsync(string fromUserId, string toUserId, decimal amount, string description, string transactionType, bool flag = false, IDbContextTransaction existingTransaction = null);
		Task<bool> ProcessRefundAsync(int refundRequestId, decimal amount, string processedById, IDbContextTransaction existingTransaction = null);
		Task<bool> PayFromWalletAsync(int bookingId, string userId, decimal amount);
	}
}