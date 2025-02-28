using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class VaccineTransactionHistoryRepository : IVaccineTransactionHistoryRepository
    {
        private readonly ChildVaccineSystemDBContext _context;
        private readonly DbSet<VaccineTransactionHistory> _dbSet;

        public VaccineTransactionHistoryRepository(ChildVaccineSystemDBContext context)
        {
            _context = context;
            _dbSet = context.Set<VaccineTransactionHistory>();
        }

        public async Task<VaccineTransactionHistory> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<VaccineTransactionHistory>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task AddAsync(VaccineTransactionHistory entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task UpdateAsync(VaccineTransactionHistory entity)
        {
            _dbSet.Update(entity);
            await Task.CompletedTask;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }
    }
}
