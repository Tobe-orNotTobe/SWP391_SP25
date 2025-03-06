using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface ITransactionRepository : IRepository<Transaction>
	{
        // Phương thức lấy tất cả giao dịch theo ngày
        Task<IEnumerable<Transaction>> GetTransactionsByDateAsync(DateTime date);

        // Phương thức tính tổng doanh thu
        Task<decimal> GetTotalRevenueAsync();
    }
}
