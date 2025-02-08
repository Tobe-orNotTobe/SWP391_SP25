using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;

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
                .Include(cv => cv.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ComboVaccine> GetByIdAsync(int id)
        {
            return await _context.ComboVaccines
                .Include(cv => cv.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .AsNoTracking()
                .FirstOrDefaultAsync(cv => cv.ComboId == id);
        }

        public async Task<bool> ValidateScheduleIdAsync(int scheduleId)
        {
            return await _context.VaccinationSchedules.AnyAsync(s => s.ScheduleId == scheduleId);
        }

        public async Task<ComboVaccine> CreateAsync(ComboVaccine combo)
        {
            // Add combo vaccine
            _context.ComboVaccines.Add(combo);
            await _context.SaveChangesAsync();
            return combo;
        }


        public async Task<ComboVaccine> UpdateAsync(ComboVaccine combo)
        {
            var existingCombo = await _context.ComboVaccines
                .Include(cv => cv.ComboDetails)
                .FirstOrDefaultAsync(cv => cv.ComboId == combo.ComboId);

            if (existingCombo == null)
            {
                throw new Exception("ComboVaccine not found.");
            }

            // Update fields
            existingCombo.ComboName = combo.ComboName;
            existingCombo.Description = combo.Description;
            existingCombo.TotalPrice = combo.TotalPrice;
            existingCombo.IsActive = combo.IsActive;
            existingCombo.ValidityMonths = combo.ValidityMonths;
            existingCombo.EffectiveDate = combo.EffectiveDate;
            existingCombo.ExpiryDate = combo.ExpiryDate;

            // Update ComboDetails
            _context.ComboDetails.RemoveRange(existingCombo.ComboDetails);
            existingCombo.ComboDetails = combo.ComboDetails;

            _context.ComboVaccines.Update(existingCombo);
            await _context.SaveChangesAsync();

            return existingCombo;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var combo = await _context.ComboVaccines
                .Include(c => c.ComboDetails) // Include related ComboDetails
                .FirstOrDefaultAsync(c => c.ComboId == id);

            if (combo == null)
                return false;

            // Remove related ComboDetails explicitly
            _context.ComboDetail.RemoveRange(combo.ComboDetails);

            // Remove the ComboVaccine
            _context.ComboVaccines.Remove(combo);

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
