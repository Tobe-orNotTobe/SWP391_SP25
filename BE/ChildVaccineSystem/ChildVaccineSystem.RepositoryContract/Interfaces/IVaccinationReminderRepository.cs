using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface IVaccinationReminderRepository : IRepository<VaccinationReminder>
	{
		Task<IEnumerable<VaccinationReminder>> GetDueRemindersAsync();
		Task<IEnumerable<Booking>> GetUpcomingBookingsForRemindersAsync(int daysThreshold);
		Task<bool> HasReminderForBookingAsync(int bookingId);
	}
}