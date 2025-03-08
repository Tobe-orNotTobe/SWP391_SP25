using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class WalletDepositRepository : Repository<WalletDeposit>, IWalletDepositRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public WalletDepositRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

		public async Task<List<WalletDeposit>> GetUserDepositsAsync(string userId)
		{
			return await _context.WalletDeposits
				.Where(d => d.UserId == userId)
				.OrderByDescending(d => d.CreatedAt)
				.ToListAsync();
		}

		public async Task UpdateStatusAsync(int id, string status, string responseCode)
		{
			var deposit = await _context.WalletDeposits.FindAsync(id);
			if (deposit != null)
			{
				deposit.Status = status;
				deposit.ResponseCode = responseCode;
				deposit.ProcessedAt = DateTime.UtcNow;

				_context.WalletDeposits.Update(deposit);
				await _context.SaveChangesAsync();
			}
		}
	}
}