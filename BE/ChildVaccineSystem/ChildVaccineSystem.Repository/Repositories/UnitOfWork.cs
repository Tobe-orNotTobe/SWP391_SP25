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

        public IBookingRepository Bookings { get; private set; }
        public IBookingDetailRepository BookingDetails { get; private set; }
        public UnitOfWork(ChildVaccineSystemDBContext context, IVaccineRepository vaccineRepository, IVaccinationScheduleRepository vaccinationScheduleRepository, IComboVaccineRepository comboVaccineRepository, IComboDetailRepository comboDetailRepository, IBookingRepository bookingRepository, IBookingDetailRepository bookingDetailRepository)
        {
            _context = context;
            Vaccines = vaccineRepository;
            ComboVaccines = comboVaccineRepository;
            ComboDetails = comboDetailRepository;
			VaccinationSchedules = vaccinationScheduleRepository;
            Bookings = bookingRepository;
            BookingDetails = bookingDetailRepository;

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
