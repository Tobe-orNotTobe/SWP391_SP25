using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.Data.Models;

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

        public async Task<ComboVaccine> GetByIdAsync(int id)
        {
            return await _context.ComboVaccines
                .Include(c => c.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .FirstOrDefaultAsync(c => c.ComboId == id);
        }

        public async Task<ComboVaccine> CreateAsync(ComboVaccine combo)
        {
            _context.ComboVaccines.Add(combo);
            await _context.SaveChangesAsync();
            return combo;
        }

        public async Task<ComboVaccine> UpdateAsync(ComboVaccine combo)
        {
            var existingCombo = await _context.ComboVaccines
                .Include(c => c.ComboDetails)
                .FirstOrDefaultAsync(c => c.ComboId == combo.ComboId);

            if (existingCombo == null)
                throw new Exception("ComboVaccine not found.");

            // Update the fields
            existingCombo.ComboName = combo.ComboName;
            existingCombo.Description = combo.Description;
            existingCombo.TotalPrice = combo.TotalPrice;
            existingCombo.IsActive = combo.IsActive;
            existingCombo.ValidityMonths = combo.ValidityMonths;
            existingCombo.EffectiveDate = combo.EffectiveDate;
            existingCombo.ExpiryDate = combo.ExpiryDate;

            // Update ComboDetails if needed
            if (combo.ComboDetails != null)
            {
                // Remove old ComboDetails
                _context.ComboDetail.RemoveRange(existingCombo.ComboDetails);

                // Add updated ComboDetails
                existingCombo.ComboDetails = combo.ComboDetails;
            }

            _context.ComboVaccines.Update(existingCombo);
            await _context.SaveChangesAsync();
            return existingCombo;
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
