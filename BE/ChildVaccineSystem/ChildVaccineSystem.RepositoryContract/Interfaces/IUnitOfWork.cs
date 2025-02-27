using ChildVaccineSystem.Data.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IVaccineRepository Vaccines { get; }

		IComboVaccineRepository ComboVaccines { get; }
		IComboDetailRepository ComboDetails { get; }
		IVaccinationScheduleRepository VaccinationSchedules { get; }
        IBookingRepository Bookings { get; }
        IBookingDetailRepository BookingDetails { get; }
		IInjectionScheduleRepository InjectionSchedules { get; }
		IVaccineScheduleDetailRepository VaccineScheduleDetails { get; }
		IChildrenRepository Children { get; }
        IUserRepository Users { get; }
        IVaccineInventoryRepository VaccineInventories { get; }
        IPricingPoliciesRepository PricingPolicies { get; }
<<<<<<< HEAD
=======
        ITransactionRepository Transactions { get; }
>>>>>>> 6a23a229a73d7a4ab6cce73b3829c73b697887e9
        Task<int> CompleteAsync();
		Task<IDbContextTransaction> BeginTransactionAsync();

	}
}
