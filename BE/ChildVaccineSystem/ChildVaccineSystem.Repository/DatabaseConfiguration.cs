using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChildVaccineSystem.Repository
{
	public static class DatabaseConfiguration
	{
		public static IServiceCollection ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
		{
			// Register DbContext
			services.AddDbContext<ChildVaccineSystemDBContext>(options =>
				options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

			// Register Identity with EF
			services.AddIdentity<User, IdentityRole>()
				.AddEntityFrameworkStores<ChildVaccineSystemDBContext>()
				.AddDefaultTokenProviders();

			return services;
		}
	}
}
