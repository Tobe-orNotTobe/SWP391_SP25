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
    public class ComboVaccineRepository : Repository<ComboVaccine>, IComboVaccineRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public ComboVaccineRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;

        public async Task<IEnumerable<ComboVaccine>> GetAll()
        {
            return await _context.ComboVaccines
                .Include(cv => cv.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ComboVaccine> GetById(int id)
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

        public async Task<List<int>> GetVaccineIdsFromComboAsync(int comboVaccineId)
        {
            return await _context.ComboDetails
                .Where(cd => cd.ComboId == comboVaccineId)
                .Select(cd => cd.VaccineId)
                .ToListAsync();
        }

    }
}
