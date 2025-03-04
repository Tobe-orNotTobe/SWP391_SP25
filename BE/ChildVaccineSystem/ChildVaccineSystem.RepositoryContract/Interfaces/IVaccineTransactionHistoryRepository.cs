using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IVaccineTransactionHistoryRepository
    {
        Task<VaccineTransactionHistory> GetByIdAsync(int id);
        Task<IEnumerable<VaccineTransactionHistory>> GetAllAsync();
        Task AddAsync(VaccineTransactionHistory entity);
        Task UpdateAsync(VaccineTransactionHistory entity);
        Task DeleteAsync(int id);
    }
}
