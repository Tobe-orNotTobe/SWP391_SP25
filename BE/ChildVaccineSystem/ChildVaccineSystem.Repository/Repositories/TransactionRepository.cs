using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class TransactionRepository : Repository<Transaction>, ITransactionRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public TransactionRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;
        
        // Phương thức lấy tất cả giao dịch theo ngày
        public async Task<IEnumerable<Transaction>> GetTransactionsByDateAsync(DateTime date)
        {
            return await _context.Transactions
                .Where(t => t.CreatedAt.Date == date.Date)
                .ToListAsync();
        }

        // Phương thức lấy tổng doanh thu cho tất cả các giao dịch
        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.Transactions
                .SumAsync(t => t.Amount);
        }
    }
}
