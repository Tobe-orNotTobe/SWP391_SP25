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

            if (adminWallet == null)
            {
                throw new InvalidOperationException("Ví quản trị chưa được cấu hình!");
            }

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
                Status = "Hoàn thành",
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Wallets.AddTransactionAsync(transaction);

            await _unitOfWork.Wallets.UpdateWalletBalanceAsync(adminWallet.WalletId, addFundsDto.Amount);

            return await GetAdminWalletAsync();
        }

        public async Task<string> CreateDepositAsync(string userId, WalletDepositDTO depositDto, string ipAddress)
        {
            var wallet = await _unitOfWork.Wallets.GetWalletByUserIdAsync(userId);

            var walletTransaction = new WalletTransaction
            {
                WalletId = wallet.WalletId,
                Amount = depositDto.Amount,
                TransactionType = "Nạp tiền",
                Description = $"Nạp tiền vào ví",
                Status = "Đang chờ xử lý",
                CreatedAt = DateTime.UtcNow
            };

            var result = await _unitOfWork.Wallets.AddTransactionAsync(walletTransaction);

            try
            {
                string paymentUrl = await _vnPaymentService.CreateWalletDepositUrl(result.WalletTransactionId, depositDto.Amount, userId, ipAddress);

                return paymentUrl;
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Lỗi tạo url!");
            }
        }


        public async Task<bool> ProcessDepositAsync(int walletTransactionId, string responseCode)
        {
            var walletTransaction = await _unitOfWork.WalletTransactions.GetAsync(w => w.WalletTransactionId == walletTransactionId);

            if (walletTransaction == null)
            {
                return false;
            }

            var wallet = await _unitOfWork.Wallets.GetAsync(w => w.WalletId == walletTransaction.WalletId);

            if (responseCode == "00")
            {
                walletTransaction.Status = "Hoàn thành";
                await _unitOfWork.WalletTransactions.UpdateAsync(walletTransaction);
                await _unitOfWork.CompleteAsync();

                await _unitOfWork.Wallets.UpdateWalletBalanceAsync(wallet.WalletId, walletTransaction.Amount);
                return true;
            }
            else
            {
                walletTransaction.Status = "Thất bại";
                await _unitOfWork.WalletTransactions.UpdateAsync(walletTransaction);
                await _unitOfWork.CompleteAsync();

                return false;
            }
        }

        public async Task<bool> TransferFundsAsync(string fromUserId, string toUserId, decimal amount, string description, string transactionType, bool flag = false, IDbContextTransaction existingTransaction = null)
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
                    TransactionType = transactionType,
                    Description = description,
                    Status = "Hoàn Thành",
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Wallets.AddTransactionAsync(withdrawalTx);

                var depositTx = new WalletTransaction
                {
                    WalletId = destWallet.WalletId,
                    Amount = amount,
                    TransactionType = transactionType,
                    Description = description,
                    Status = "Hoàn Thành",
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
                return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, "Hoàn tiền", flag, existingTransaction);
            }
            else
            {
                return await TransferFundsAsync(adminWallet.UserId, refundRequest.UserId, amount, description, "Hoàn tiền", flag);
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

            var description = $"Thanh toán lịch hẹn";
            return await TransferFundsAsync(userId, adminWallet.UserId, amount, "Thanh toán lịch hẹn", description);
        }
    }
}