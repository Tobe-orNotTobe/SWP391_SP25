using AutoMapper;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace ChildVaccineSystem.Service.Services
{
	public class WalletService : IWalletService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;
		private readonly IVnPaymentService _vnPaymentService;

		public WalletService(
			IUnitOfWork unitOfWork,
			IMapper mapper,
			IVnPaymentService vnPaymentService)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
			_vnPaymentService = vnPaymentService;
		}

		public async Task<WalletDTO> GetUserWalletAsync(string userId)
		{
			var wallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);

			if (wallet == null)
			{
				wallet = await _unitOfWork.Wallets.CreateWalletAsync(userId);
			}

			var transactions = await _unitOfWork.Wallets.GetWalletTransactionsAsync(wallet.WalletId, 10);

			var walletDto = _mapper.Map<WalletDTO>(wallet);
			walletDto.RecentTransactions = _mapper.Map<List<WalletTransactionDTO>>(transactions);

			return walletDto;
		}

		public async Task<WalletDTO> GetAdminWalletAsync()
		{
			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();

			if (adminWallet == null)
			{
				throw new InvalidOperationException("Admin wallet is not configured. Please contact the system administrator.");
			}

			var transactions = await _unitOfWork.Wallets.GetWalletTransactionsAsync(adminWallet.WalletId, 10);

			var walletDto = _mapper.Map<WalletDTO>(adminWallet);
			walletDto.RecentTransactions = _mapper.Map<List<WalletTransactionDTO>>(transactions);

			return walletDto;
		}

		public async Task<WalletDTO> CreateWalletAsync(string userId, bool isAdminWallet = false)
		{
			var existingWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);
			if (existingWallet != null)
			{
				throw new InvalidOperationException("Wallet already exists for this user.");
			}

			var wallet = await _unitOfWork.Wallets.CreateWalletAsync(userId, isAdminWallet);
			return _mapper.Map<WalletDTO>(wallet);
		}

		public async Task<WalletDTO> AddFundsToAdminWalletAsync(AddFundsDTO addFundsDto)
		{
			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();

			if (adminWallet == null)
			{
				throw new InvalidOperationException("Admin wallet is not configured. Please contact the system administrator.");
			}

			var transaction = new WalletTransaction
			{
				WalletId = adminWallet.WalletId,
				Amount = addFundsDto.Amount,
				TransactionType = "Deposit",
				Description = $"Admin fund deposit",
				CreatedAt = DateTime.UtcNow
			};

			await _unitOfWork.Wallets.AddTransactionAsync(transaction);

			await _unitOfWork.Wallets.UpdateWalletBalanceAsync(adminWallet.WalletId, addFundsDto.Amount);

			return await GetAdminWalletAsync();
		}

		public async Task<bool> TransferFundsAsync(string fromUserId, string toUserId, decimal amount, string description, int? refundRequestId = null, IDbContextTransaction existingTransaction = null)
		{
			var shouldCommitTransaction = existingTransaction == null;
			var transaction = existingTransaction ?? await _unitOfWork.BeginTransactionAsync();

			try
			{
				var sourceWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(fromUserId);
				if (sourceWallet == null)
				{
					throw new InvalidOperationException("Source wallet not found.");
				}

				if (sourceWallet.Balance < amount)
				{
					throw new InvalidOperationException("Insufficient balance in source wallet.");
				}

				var destWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(toUserId);
				if (destWallet == null)
				{
					destWallet = await _unitOfWork.Wallets.CreateWalletAsync(toUserId);
				}

				var withdrawalTx = new WalletTransaction
				{
					WalletId = sourceWallet.WalletId,
					Amount = -amount,
					TransactionType = "Transfer",
					Description = description,
					RefundRequestId = refundRequestId,
					CreatedAt = DateTime.UtcNow
				};
				await _unitOfWork.Wallets.AddTransactionAsync(withdrawalTx);

				var depositTx = new WalletTransaction
				{
					WalletId = destWallet.WalletId,
					Amount = amount,
					TransactionType = "Transfer",
					Description = description,
					RefundRequestId = refundRequestId,
					CreatedAt = DateTime.UtcNow
				};
				await _unitOfWork.Wallets.AddTransactionAsync(depositTx);

				await _unitOfWork.Wallets.UpdateWalletBalanceAsync(sourceWallet.WalletId, -amount);
				await _unitOfWork.Wallets.UpdateWalletBalanceAsync(destWallet.WalletId, amount);

				if (shouldCommitTransaction)
				{
					await transaction.CommitAsync();
				}

				return true;
			}
			catch (Exception)
			{
				if (shouldCommitTransaction)
				{
					await transaction.RollbackAsync();
				}
				throw;
			}
		}

		public async Task<bool> ProcessRefundAsync(int refundRequestId, decimal amount, string processedById, IDbContextTransaction existingTransaction = null)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(refundRequestId);
			if (refundRequest == null)
			{
				throw new InvalidOperationException("Refund request not found.");
			}

			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();
			if (adminWallet == null)
			{
				throw new InvalidOperationException("Admin wallet is not configured.");
			}

			if (adminWallet.Balance < amount)
			{
				throw new InvalidOperationException("Insufficient funds in admin wallet to process refund.");
			}

			var description = $"Refund for booking #{refundRequest.BookingId}";

			if (existingTransaction != null)
			{
				return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, refundRequestId, existingTransaction);
			}
			else
			{
				return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, refundRequestId);
			}
		}

		public async Task<bool> PayFromWalletAsync(int bookingId, string userId, decimal amount)
		{
			var userWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);
			if (userWallet == null)
			{
				throw new InvalidOperationException("User wallet not found.");
			}

			if (userWallet.Balance < amount)
			{
				throw new InvalidOperationException($"Insufficient balance in wallet. Available: {userWallet.Balance}, Required: {amount}");
			}

			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();
			if (adminWallet == null)
			{
				throw new InvalidOperationException("Admin wallet is not configured.");
			}

			var description = $"Payment for booking #{bookingId}";
			return await TransferFundsAsync(userId, adminWallet.UserId, amount, description);
		}

		public async Task<bool> AddFundsToUserWalletAsync(string userId, decimal amount, string transactionReference)
		{
			try
			{
				var wallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);
				if (wallet == null)
				{
					wallet = await _unitOfWork.Wallets.CreateWalletAsync(userId);
				}

				var transaction = new WalletTransaction
				{
					WalletId = wallet.WalletId,
					Amount = amount,
					TransactionType = "Deposit",
					Description = $"Deposit via VnPay (Ref: {transactionReference})",
					CreatedAt = DateTime.UtcNow
				};

				await _unitOfWork.Wallets.AddTransactionAsync(transaction);
				await _unitOfWork.Wallets.UpdateWalletBalanceAsync(wallet.WalletId, amount);

				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}
	}
}