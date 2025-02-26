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
	public class VaccinationScheduleRepository : Repository<VaccinationSchedule>, IVaccinationScheduleRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public VaccinationScheduleRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;


	}
}
