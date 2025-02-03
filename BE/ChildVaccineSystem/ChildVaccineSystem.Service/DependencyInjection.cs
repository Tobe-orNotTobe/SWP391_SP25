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
            return services;
        }
    }
}