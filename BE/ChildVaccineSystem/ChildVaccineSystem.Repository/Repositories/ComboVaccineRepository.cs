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
    public class ComboVaccineRepository : IComboVaccineRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public ComboVaccineRepository(ChildVaccineSystemDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ComboVaccine>> GetAllAsync()
        {
            return await _context.ComboVaccines
                .Include(c => c.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .ToListAsync();
        }

        public async Task<ComboVaccine?> GetByIdAsync(int id)
        {
            return await _context.ComboVaccines
                .Include(c => c.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .FirstOrDefaultAsync(c => c.ComboId == id);
        }

        public async Task<ComboVaccine> CreateAsync(ComboVaccine combo, IEnumerable<int> vaccineIds)
        {
            _context.ComboVaccines.Add(combo);
            await _context.SaveChangesAsync();

            foreach (var vaccineId in vaccineIds)
            {
                var comboDetail = new ComboDetail
                {
                    ComboId = combo.ComboId,
                    VaccineId = vaccineId
                };
                _context.ComboDetail.Add(comboDetail);
            }

            await _context.SaveChangesAsync();
            return combo;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var combo = await _context.ComboVaccines.FindAsync(id);
            if (combo == null) return false;

            _context.ComboVaccines.Remove(combo);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
