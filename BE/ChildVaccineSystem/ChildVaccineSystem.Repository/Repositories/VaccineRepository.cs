using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.Data.Models;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class VaccineRepository : Repository<Vaccine>, IVaccineRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

		public VaccineRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;

		public async Task<IEnumerable<Vaccine>> GetVaccinesByTypeAsync(bool isNecessary)
        {
            return await _context.Vaccines
                .AsNoTracking()
                .Where(v => v.IsNecessary == isNecessary)
                .ToListAsync();
        }
        public async Task<Vaccine?> GetByIdAsync(int id)
        {
            return await _context.Vaccines
                .FirstOrDefaultAsync(v => v.VaccineId == id);
        }
    }
}
