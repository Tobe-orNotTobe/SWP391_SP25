using Microsoft.Extensions.DependencyInjection;
using ChildVaccineSystem.Repository.Repositories;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.Extensions.Configuration;

namespace ChildVaccineSystem.Repository
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepository(this IServiceCollection services, IConfiguration configuration)
        {
			services.ConfigureDatabase(configuration);

			services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            services.AddTransient<IVaccineRepository, VaccineRepository>();
            services.AddTransient<IEmailRepository, EmailRepository>();
            services.AddTransient<IComboVaccineRepository, ComboVaccineRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
			services.AddTransient<IComboDetailRepository, ComboDetailRepository>();
			services.AddTransient<IVaccinationScheduleRepository, VaccinationScheduleRepository>();
            services.AddTransient<IBookingRepository, BookingRepository>();
            services.AddTransient<IBookingDetailRepository, BookingDetailRepository>();
            services.AddTransient<IInjectionScheduleRepository, InjectionScheduleRepository>();
			services.AddTransient<IVaccineScheduleDetailRepository, VaccineScheduleDetailRepository>();
            services.AddTransient<IChildrenRepository, ChildrenRepository>();
            services.AddTransient<IVaccineInventoryRepository, VaccineInventoryRepository>();
            services.AddTransient<IPricingPoliciesRepository, PricingPoliciesRepository>();
			services.AddTransient<ITransactionRepository, TransactionRepository>();
            services.AddTransient<IVaccineTransactionHistoryRepository, VaccineTransactionHistoryRepository>();
            services.AddTransient<IDoctorWorkScheduleRepository, DoctorWorkScheduleRepository>();
            services.AddTransient<IBlogPostRepository, BlogPostRepository>();
            services.AddTransient<IFeedbackRepository, FeedbackRepository>();
			services.AddTransient<IWalletRepository, WalletRepository>();
			services.AddTransient<IRefundRequestRepository, RefundRequestRepository>();
			services.AddTransient<IVaccineRecordRepository, VaccineRecordRepository>();
			services.AddTransient<IWalletTransactionRepository, WalletTransactionRepository>();
			services.AddTransient<INotificationRepository, NotificationRepository>();
			services.AddTransient<IVaccinationReminderRepository, VaccinationReminderRepository>();

			//DI Unit of Work
			services.AddTransient<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
