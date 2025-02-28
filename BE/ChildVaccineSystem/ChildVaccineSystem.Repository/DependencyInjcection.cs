using Microsoft.Extensions.DependencyInjection;
using ChildVaccineSystem.Repository.Repositories;
using ChildVaccineSystem.RepositoryContract.Interfaces;

namespace ChildVaccineSystem.Repository
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
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
            //DI Unit of Work
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
