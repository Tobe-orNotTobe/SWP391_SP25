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

            //DI Unit of Work
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
