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
    public class ChildrenRepository : Repository<Children>, IChildrenRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public ChildrenRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

    }
}
