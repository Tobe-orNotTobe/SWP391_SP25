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

		private async Task<WalletDTO> GetAdminWalletAsync()
		{
			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();

			var transactions = await _unitOfWork.Wallets.GetWalletTransactionsAsync(adminWallet.WalletId, 10);

			var walletDto = _mapper.Map<WalletDTO>(adminWallet);
			walletDto.RecentTransactions = _mapper.Map<List<WalletTransactionDTO>>(transactions);

			return walletDto;
		}

		public async Task CreateWalletAsync(string userId, bool isAdminWallet = false)
		{
			var wallet = await _unitOfWork.Wallets.CreateWalletAsync(userId, isAdminWallet);
			return;
		}

		public async Task CreateAdminWalletAsync(string userId)
		{	
			var wallet = await _unitOfWork.Wallets.CreateAdminWalletAsync(userId);
			return;
		}

		public async Task<WalletDTO> AddFundsToAdminWalletAsync(AddFundsDTO addFundsDto)
		{
			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();

			if (adminWallet == null)
			{
				throw new InvalidOperationException("Ví quản trị chưa được cấu hình!");
			}

			var transaction = new WalletTransaction
			{
				WalletId = adminWallet.WalletId,
				Amount = addFundsDto.Amount,
				TransactionType = "Nạp tiền",
				Description = $"Admin nạp tiền",
				CreatedAt = DateTime.UtcNow
			};

			await _unitOfWork.Wallets.AddTransactionAsync(transaction);

			await _unitOfWork.Wallets.UpdateWalletBalanceAsync(adminWallet.WalletId, addFundsDto.Amount);

			return await GetAdminWalletAsync();
		}

		public async Task<bool> TransferFundsAsync(string fromUserId, string toUserId, decimal amount, string description, int? refundRequestId = null, bool flag = false, IDbContextTransaction existingTransaction = null)
		{
			var shouldCommitTransaction = existingTransaction == null;
			var transaction = existingTransaction ?? await _unitOfWork.BeginTransactionAsync();

			try
			{
				var sourceWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(fromUserId);
				if (sourceWallet == null)
				{
					throw new InvalidOperationException("Không tìm thấy ví của người dùng.");
				}

				if (sourceWallet.Balance < amount)
				{
					throw new InvalidOperationException("Số dư trong ví không đủ.");
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
					TransactionType = "Chuyển khoản",
					Description = description,
					RefundRequestId = refundRequestId,
					CreatedAt = DateTime.UtcNow
				};
				await _unitOfWork.Wallets.AddTransactionAsync(withdrawalTx);

				var depositTx = new WalletTransaction
				{
					WalletId = destWallet.WalletId,
					Amount = amount,
					TransactionType = "Chuyển khoản",
					Description = description,
					RefundRequestId = refundRequestId,
					CreatedAt = DateTime.UtcNow
				};
				await _unitOfWork.Wallets.AddTransactionAsync(depositTx);

				if (flag is false)
				{
					await _unitOfWork.Wallets.UpdateWalletBalanceAsync(sourceWallet.WalletId, -amount);
					await _unitOfWork.Wallets.UpdateWalletBalanceAsync(destWallet.WalletId, amount);
				}
				else
				{
					await _unitOfWork.Wallets.UpdateWalletBalanceByRefundAsync(sourceWallet.WalletId, -amount);
					await _unitOfWork.Wallets.UpdateWalletBalanceByRefundAsync(destWallet.WalletId, amount);
				}

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
				throw new InvalidOperationException("Không tìm thấy yêu cầu hoàn tiền!");
			}

			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();
			if (adminWallet == null)
			{
				throw new InvalidOperationException("Ví admin chưa được cấu hình!");
			}

			if (adminWallet.Balance < amount)
			{
				throw new InvalidOperationException("Không đủ tiền trong ví admin để xử lý việc hoàn tiền!");
			}

			var description = $"Hoàn tiền cho lịch hẹn #{refundRequest.BookingId}";

			bool flag = true;

			if (existingTransaction != null)
			{
				return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, refundRequestId, flag, existingTransaction);
			}
			else
			{
				return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, refundRequestId, flag);
			}
		}

		public async Task<bool> PayFromWalletAsync(int bookingId, string userId, decimal amount)
		{
			var userWallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);
			if (userWallet == null)
			{
				throw new InvalidOperationException("Không tìm thấy ví người dùng!");
			}

			if (userWallet.Balance < amount)
			{
				throw new InvalidOperationException($"Số dư trong ví không đủ. Hiện có: {userWallet.Balance}. Cần trả: {amount}");
			}

			var adminWallet = await _unitOfWork.Wallets.GetAdminWalletAsync();
			if (adminWallet == null)
			{
				throw new InvalidOperationException("Ví quản trị chưa được cấu hình!");
			}

			var description = $"Thanh toán cho lịch hẹn #{bookingId}";
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
					TransactionType = "Nạp tiền",
					Description = $"Nạp tiền qua VnPay (Ref: {transactionReference})",
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