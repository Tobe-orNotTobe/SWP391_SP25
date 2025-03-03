using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class ComboDetailRepository : Repository<ComboDetail>, IComboDetailRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public ComboDetailRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;
    }
}
