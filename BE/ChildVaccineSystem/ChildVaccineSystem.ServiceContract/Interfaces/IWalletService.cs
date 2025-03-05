using ChildVaccineSystem.Data.DTO.Wallet;
using Microsoft.EntityFrameworkCore.Storage;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IWalletService
	{
		Task<WalletDTO> GetUserWalletAsync(string userId);
		Task<WalletDTO> GetAdminWalletAsync();
		Task<WalletDTO> CreateWalletAsync(string userId, bool isAdminWallet = false);
		Task<WalletDTO> AddFundsToAdminWalletAsync(AddFundsDTO addFundsDto);
		Task<bool> TransferFundsAsync(string fromUserId, string toUserId, decimal amount, string description, int? refundRequestId = null, IDbContextTransaction existingTransaction = null);
		Task<bool> ProcessRefundAsync(int refundRequestId, decimal amount, string processedById, IDbContextTransaction existingTransaction = null);
		Task<bool> PayFromWalletAsync(int bookingId, string userId, decimal amount);
		Task<bool> AddFundsToUserWalletAsync(string userId, decimal amount, string transactionReference);
	}
}