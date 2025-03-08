using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class WalletRepository : Repository<Wallet>, IWalletRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public WalletRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

		public async Task<Wallet> GetWalletByUserIdAsync(string userId)
		{
			return await _context.Wallets
				.FirstOrDefaultAsync(w => w.UserId == userId);
		}

		public async Task<Wallet> GetAdminWalletAsync()
		{
			return await _context.Wallets
				.FirstOrDefaultAsync(w => w.IsAdminWallet);
		}

		public async Task<Wallet> CreateWalletAsync(string userId, bool isAdminWallet = false)
		{
			var wallet = new Wallet
			{
				UserId = userId,
				Balance = 0,
				IsAdminWallet = isAdminWallet,
				CreatedAt = DateTime.UtcNow
			};

			await _context.Wallets.AddAsync(wallet);
			await _context.SaveChangesAsync();

			return wallet;
		}

		public async Task<Wallet> CreateAdminWalletAsync(string userId)
		{
			var wallet = new Wallet
			{
				UserId = userId,
				Balance = 0,
				IsAdminWallet = true,
				CreatedAt = DateTime.UtcNow
			};

			await _context.Wallets.AddAsync(wallet);
			await _context.SaveChangesAsync();

			return wallet;
		}

		public async Task<List<WalletTransaction>> GetWalletTransactionsAsync(int walletId, int count = 10)
		{
			return await _context.WalletTransactions
				.Where(t => t.WalletId == walletId)
				.OrderByDescending(t => t.CreatedAt)
				.Take(count)
				.ToListAsync();
		}

		public async Task<WalletTransaction> AddTransactionAsync(WalletTransaction transaction)
		{
			await _context.WalletTransactions.AddAsync(transaction);
			await _context.SaveChangesAsync();
			return transaction;
		}

		public async Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount)
		{
			var wallet = await _context.Wallets.FindAsync(walletId);
			if (wallet == null)
				return false;

			wallet.Balance += amount;
			wallet.UpdatedAt = DateTime.UtcNow;

			_context.Wallets.Update(wallet);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> UpdateWalletBalanceByRefundAsync(int walletId, decimal amountRefund)
		{
			var wallet = await _context.Wallets.FindAsync(walletId);
			if (wallet == null)
				return false;

			wallet.Balance += amountRefund;
			wallet.UpdatedAt = DateTime.UtcNow;

			if (!wallet.IsAdminWallet)
			{
				wallet.TotalRefunded += amountRefund;
			}

			_context.Wallets.Update(wallet);
			await _context.SaveChangesAsync();
			return true;
		}
	}
}