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
            return services;
        }
    }
}