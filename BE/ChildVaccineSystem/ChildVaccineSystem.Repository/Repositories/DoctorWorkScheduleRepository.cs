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
    public class DoctorWorkScheduleRepository : Repository<DoctorWorkSchedule>, IDoctorWorkScheduleRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public DoctorWorkScheduleRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }
    }

}
