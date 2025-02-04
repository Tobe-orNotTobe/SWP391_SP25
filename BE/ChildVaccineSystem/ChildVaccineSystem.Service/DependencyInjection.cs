using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Service.Services;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ChildVaccineSystem.Service
{
    public static class DependencyInjcection
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IVaccineService, VaccineService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<APIResponse>();
            return services;
        }
    }
}