using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Service.Services;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ChildVaccineSystem.Service
{
    public static class DependencyInjcection
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {

            services.AddTransient<IVaccineService, VaccineService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<APIResponse>();
            services.AddTransient<IComboVaccineService, ComboVaccineService>();
            services.AddTransient<IAuthService, AuthService>();
			services.AddTransient<IVaccinationScheduleService, VaccinationScheduleService>();
            services.AddTransient<IBookingService, BookingService>();
            services.AddTransient<IChildrenService, ChildrenService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IVaccineInventoryService, VaccineInventoryService>();
<<<<<<< HEAD

            return services;
=======
            services.AddTransient<IVnPaymentService, VnPaymentService>();
			services.AddTransient<ITransactionService, TransactionService>();

			return services;
>>>>>>> 6a23a229a73d7a4ab6cce73b3829c73b697887e9
        }
    }
}