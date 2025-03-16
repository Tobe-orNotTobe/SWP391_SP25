using ChildVaccineSystem.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface INotificationRepository : IRepository<Notification>
	{
		Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
		Task<int> GetUnreadCountAsync(string userId);
		Task<Notification> GetNotificationByIdAsync(int id);
		Task<bool> MarkAsReadAsync(int id, string userId);
		Task<IEnumerable<Booking>> GetUpcomingBookingsAsync(int daysThreshold);
	}
}