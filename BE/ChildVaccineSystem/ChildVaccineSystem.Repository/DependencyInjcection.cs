using Microsoft.Extensions.DependencyInjection;
using ChildVaccineSystem.Repository.Repositories;
using ChildVaccineSystem.RepositoryContract.Interfaces;

namespace ChildVaccineSystem.Repository
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IVaccineRepository, VaccineRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            return services;
        }
    }
}
