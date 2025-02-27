using System;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

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
		public IInjectionScheduleRepository InjectionSchedules { get; }
		public IVaccineScheduleDetailRepository VaccineScheduleDetails { get; }
        public IChildrenRepository Children { get; }
        public IUserRepository Users { get; }
        public IVaccineInventoryRepository VaccineInventories { get; }
        public IPricingPoliciesRepository PricingPolicies { get; }
<<<<<<< HEAD
        public UnitOfWork(ChildVaccineSystemDBContext context, IVaccineRepository vaccineRepository, IVaccinationScheduleRepository vaccinationScheduleRepository, IComboVaccineRepository comboVaccineRepository, IComboDetailRepository comboDetailRepository, IBookingRepository bookingRepository, IBookingDetailRepository bookingDetailRepository, IInjectionScheduleRepository injectionScheduleRepository, IVaccineScheduleDetailRepository vaccineScheduleDetailRepository, IChildrenRepository childrenRepository, IUserRepository userRepository, IVaccineInventoryRepository vaccineInventories, IPricingPoliciesRepository pricingPolicies)
=======
        public ITransactionRepository Transactions { get; }
        public UnitOfWork(ChildVaccineSystemDBContext context, IVaccineRepository vaccineRepository, IVaccinationScheduleRepository vaccinationScheduleRepository, IComboVaccineRepository comboVaccineRepository, IComboDetailRepository comboDetailRepository, IBookingRepository bookingRepository, IBookingDetailRepository bookingDetailRepository, IInjectionScheduleRepository injectionScheduleRepository, IVaccineScheduleDetailRepository vaccineScheduleDetailRepository, IChildrenRepository childrenRepository, IUserRepository userRepository, IVaccineInventoryRepository vaccineInventories, IPricingPoliciesRepository pricingPolicies, ITransactionRepository transactionRepository)
>>>>>>> 6a23a229a73d7a4ab6cce73b3829c73b697887e9
        {
            _context = context;
            Vaccines = vaccineRepository;
            ComboVaccines = comboVaccineRepository;
            ComboDetails = comboDetailRepository;
			VaccinationSchedules = vaccinationScheduleRepository;
            Bookings = bookingRepository;
            BookingDetails = bookingDetailRepository; 
            InjectionSchedules = injectionScheduleRepository;
			VaccineScheduleDetails = vaccineScheduleDetailRepository;
            Children = childrenRepository;
            Users = userRepository;
            VaccineInventories = vaccineInventories;
            PricingPolicies = pricingPolicies;
<<<<<<< HEAD
=======
            Transactions = transactionRepository;
>>>>>>> 6a23a229a73d7a4ab6cce73b3829c73b697887e9

        }

		public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
		public async Task<IDbContextTransaction> BeginTransactionAsync()
		{
			return await _context.Database.BeginTransactionAsync();
		}

		public void Dispose()
        {
            _context.Dispose();
        }
    }
}
