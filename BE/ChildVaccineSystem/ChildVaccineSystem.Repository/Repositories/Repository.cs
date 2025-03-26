using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ChildVaccineSystemDBContext _db;
        internal DbSet<T> dbSet;

        public Repository(ChildVaccineSystemDBContext db)
        {
            _db = db;
            dbSet = db.Set<T>();
        }

        public async Task<T> AddAsync(T entity)
        {
            await _db.AddAsync(entity);
            return entity;
        }

        public async Task<T> DeleteAsync(T entity)
        {
            _db.Remove(entity);
            return entity;
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp.Trim());
                }
            }

            return await query.ToListAsync();
        }

        public async Task<T> GetAsync(Expression<Func<T, bool>> filter, string? includeProperties = null)
        {
            IQueryable<T> query = dbSet;
            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp.Trim());
                }
            }
            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _db.Update(entity);
            return entity;
        }

		public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
		{
			return await dbSet.AnyAsync(predicate);
		}
        public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await dbSet.CountAsync(predicate);
        }
    }
}
