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
        ITransactionRepository Transactions { get; }
        IDoctorWorkScheduleRepository DoctorWorkSchedules { get; }
        IVaccineTransactionHistoryRepository VaccineTransactionHistories { get; }
        IBlogPostRepository BlogPosts { get; }
        IFeedbackRepository Feedbacks { get; }
		IWalletRepository Wallets { get; }
		IRefundRequestRepository RefundRequests { get; }
		IVaccineRecordRepository VaccineRecords { get; }
		IWalletTransactionRepository WalletTransactions { get; }
		INotificationRepository Notifications { get; }
		IVaccinationReminderRepository VaccinationReminders { get; }

		Task<int> CompleteAsync();
		Task<IDbContextTransaction> BeginTransactionAsync();

	}
}
