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
                .Include(cv => cv.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .ToListAsync();
        }

        public async Task<ComboVaccine?> GetByIdAsync(int id)
        {
            return await _context.ComboVaccines
                .Include(cv => cv.ComboDetails)
                .ThenInclude(cd => cd.Vaccine)
                .FirstOrDefaultAsync(cv => cv.ComboId == id);
        }
    }
}
