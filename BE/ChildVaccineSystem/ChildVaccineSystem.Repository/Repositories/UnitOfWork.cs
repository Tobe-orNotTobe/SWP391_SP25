using System;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ChildVaccineSystemDBContext _context;

        public IVaccineRepository Vaccines { get; }

		public IComboVaccineRepository ComboVaccines { get; }
		public IComboDetailRepository ComboDetails { get; }
		public IVaccinationScheduleRepository VaccinationSchedules { get; }


		public UnitOfWork(ChildVaccineSystemDBContext context, IVaccineRepository vaccineRepository, IVaccinationScheduleRepository vaccinationScheduleRepository, IComboVaccineRepository comboVaccineRepository, IComboDetailRepository comboDetailRepository)
        {
            _context = context;
            Vaccines = vaccineRepository;
            ComboVaccines = comboVaccineRepository;
            ComboDetails = comboDetailRepository;
			VaccinationSchedules = vaccinationScheduleRepository;

		}

		public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
