using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class VaccinationReminderRepository : Repository<VaccinationReminder>, IVaccinationReminderRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public VaccinationReminderRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

		public async Task<IEnumerable<VaccinationReminder>> GetDueRemindersAsync()
		{
			return await _context.VaccinationReminders
				.Include(r => r.User)
				.Include(r => r.Children)
				.Include(r => r.Booking)
				.Where(r => r.ReminderDate.Date == DateTime.Today.Date && !r.IsSent)
				.ToListAsync();
		}

		public async Task<IEnumerable<Booking>> GetUpcomingBookingsForRemindersAsync(int daysThreshold)
		{
			var targetDate = DateTime.Now.AddDays(daysThreshold);

			return await _context.Bookings
				.Include(b => b.User)
				.Include(b => b.Children)
				.Include(b => b.BookingDetails)
					.ThenInclude(bd => bd.Vaccine)
				.Include(b => b.BookingDetails)
					.ThenInclude(bd => bd.ComboVaccine)
				.Where(b => b.BookingDate.Date == targetDate.Date &&
							b.Status == BookingStatus.Confirmed)
				.ToListAsync();
		}

		public async Task<bool> HasReminderForBookingAsync(int bookingId)
		{
			return await _context.VaccinationReminders
				.AnyAsync(r => r.BookingId == bookingId);
		}
	}
}