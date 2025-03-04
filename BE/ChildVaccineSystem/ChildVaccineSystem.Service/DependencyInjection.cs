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
            services.AddTransient<IVnPaymentService, VnPaymentService>();
			services.AddTransient<ITransactionService, TransactionService>();
            services.AddTransient<IBlogPostService, BlogPostService>();
            services.AddTransient<IFeedbackService, FeedbackService>();
			services.AddTransient<IWalletService, WalletService>();
			services.AddTransient<IRefundService, RefundService>();
			services.AddTransient<IPaymentService, PaymentService>();

			return services;
        }
    }
}