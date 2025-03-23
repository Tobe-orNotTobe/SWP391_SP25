using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class NotificationRepository : Repository<Notification>, INotificationRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public NotificationRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

		public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId)
		{
			return await _context.Notifications
				.Where(n => n.UserId == userId)
				.OrderByDescending(n => n.CreatedAt)
				.ToListAsync();
		}

		public async Task<int> GetUnreadCountAsync(string userId)
		{
			return await _context.Notifications
				.CountAsync(n => n.UserId == userId && !n.IsRead);
		}

		public async Task<Notification> GetNotificationByIdAsync(int id)
		{
			return await _context.Notifications.FindAsync(id);
		}

		public async Task<bool> MarkAsReadAsync(int id, string userId)
		{
			var notification = await _context.Notifications
				.FirstOrDefaultAsync(n => n.NotificationId == id && n.UserId == userId);

			if (notification == null)
				return false;

			notification.IsRead = true;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<IEnumerable<Booking>> GetUpcomingBookingsAsync(int daysThreshold)
		{
			var targetDate = DateTime.Now.AddDays(daysThreshold);

			return await _context.Bookings
				.Include(b => b.User)
				.Include(b => b.Children)
				.Where(b => b.BookingDate.Date == targetDate.Date &&
							b.Status == Data.Enum.BookingStatus.Confirmed)
				.ToListAsync();
		}
	}
}