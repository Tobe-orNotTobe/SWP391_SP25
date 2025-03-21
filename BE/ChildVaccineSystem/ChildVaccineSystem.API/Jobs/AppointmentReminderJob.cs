using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using System;
using System.Threading.Tasks;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.API.Jobs
{
	[DisallowConcurrentExecution]
	public class AppointmentReminderJob : IJob
	{
		private readonly IServiceProvider _serviceProvider;
		private readonly ILogger<AppointmentReminderJob> _logger;

		public AppointmentReminderJob(
			IServiceProvider serviceProvider,
			ILogger<AppointmentReminderJob> logger)
		{
			_serviceProvider = serviceProvider;
			_logger = logger;
		}

		public async Task Execute(IJobExecutionContext context)
		{
			_logger.LogInformation("Appointment Reminder Job started at: {time}", DateTimeOffset.Now);

			try
			{
				// Use a scope to get the required services
				using (var scope = _serviceProvider.CreateScope())
				{
					var reminderService = scope.ServiceProvider.GetRequiredService<IReminderService>();

					// This will handle all reminder processing:
					// 1. Clean up expired reminders
					// 2. Send due reminders for confirmed/in progress bookings
					// 3. Create new reminders for confirmed/in progress bookings that don't have reminders yet
					await reminderService.ProcessAppointmentRemindersAsync(3);
				}

				_logger.LogInformation("Appointment Reminder Job completed successfully at: {time}", DateTimeOffset.Now);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error occurred while processing appointment reminders");
			}
		}
	}
}