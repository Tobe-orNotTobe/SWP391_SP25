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
    public class PricingPoliciesRepository : Repository<PricingPolicy>, IPricingPoliciesRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public PricingPoliciesRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        // Phương thức lấy các PricingPolicy hợp lệ dựa trên sự khác biệt ngày
        public async Task<IEnumerable<PricingPolicy>> GetValidPricingPoliciesAsync(int daysDifference)
        {
            return await _context.PricingPolicies
                .Where(pp => pp.WaitTimeRangeStart <= daysDifference && pp.WaitTimeRangeEnd >= daysDifference)
                .ToListAsync();
        }
    }
}
