using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class VaccineRecordRepository : IVaccineRecordRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public VaccineRecordRepository(ChildVaccineSystemDBContext context)
        {
            _context = context;
        }

        public async Task<VaccinationRecord> GetByIdAsync(int id)
        {
            return await _context.VaccinationRecords
                .Include(vr => vr.BookingDetail)
                .ThenInclude(bd => bd.Vaccine)
                .Include(vr => vr.Child)
                .Include(vr => vr.VaccineInventory)
                .FirstOrDefaultAsync(vr => vr.VaccinationRecordId == id);
        }

        public async Task<List<VaccinationRecord>> GetAllAsync(
    Expression<Func<VaccinationRecord, bool>> filter = null,
    string includeProperties = "")
        {
            IQueryable<VaccinationRecord> query = _context.VaccinationRecords;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            return await query.ToListAsync();
        }


        public async Task AddAsync(VaccinationRecord record)
        {
            await _context.VaccinationRecords.AddAsync(record);
        }

        public void Update(VaccinationRecord record)
        {
            _context.VaccinationRecords.Update(record);
        }

        public void Delete(VaccinationRecord record)
        {
            _context.VaccinationRecords.Remove(record);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
		public async Task<VaccinationRecord?> GetByIdAsync(int id, string? includeProperties = null)
		{
			IQueryable<VaccinationRecord> query = _context.VaccinationRecords;

			if (!string.IsNullOrEmpty(includeProperties))
			{
				foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
				{
					query = query.Include(includeProperty);
				}
			}

			return await query.FirstOrDefaultAsync(vr => vr.VaccinationRecordId == id);
		}
	}
}
