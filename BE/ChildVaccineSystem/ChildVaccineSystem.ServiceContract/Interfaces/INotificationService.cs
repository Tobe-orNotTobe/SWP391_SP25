using ChildVaccineSystem.Data.DTO.Notification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface INotificationService
	{
		Task<IEnumerable<NotificationDTO>> GetUserNotificationsAsync(string userId);
		Task<int> GetUnreadCountAsync(string userId);
		Task<bool> MarkAsReadAsync(int notificationId, string userId);
		Task<bool> DeleteNotificationAsync(int notificationId, string userId);
		Task<NotificationDTO> SendNotificationAsync(SendNotificationDTO notificationDto);
		Task SendBookingReminderAsync(int bookingId, string userId, string childName);
		Task<IEnumerable<AdminNotificationDTO>> GetAdminSentNotificationsAsync();
		Task<NotificationDTO> GetNotificationByIdAsync(int id);
		Task<bool> UpdateNotificationAsync(int id, UpdateNotificationDTO updateDto);
		Task<bool> DeleteNotificationByAdminAsync(int id);
	}
}
