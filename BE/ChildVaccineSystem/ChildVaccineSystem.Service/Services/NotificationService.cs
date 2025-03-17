using AutoMapper;
using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
	public class NotificationService : INotificationService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;
		private readonly IHubContext<NotificationHub> _hubContext;
		private readonly ILogger<NotificationService> _logger;

		public NotificationService(
			IUnitOfWork unitOfWork,
			IMapper mapper,
			IHubContext<NotificationHub> hubContext,
			ILogger<NotificationService> logger)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
			_hubContext = hubContext;
			_logger = logger;
		}

		public async Task<IEnumerable<NotificationDTO>> GetUserNotificationsAsync(string userId)
		{
			var notifications = await _unitOfWork.Notifications.GetUserNotificationsAsync(userId);
			return _mapper.Map<IEnumerable<NotificationDTO>>(notifications);
		}

		public async Task<int> GetUnreadCountAsync(string userId)
		{
			return await _unitOfWork.Notifications.GetUnreadCountAsync(userId);
		}

		public async Task<bool> MarkAsReadAsync(int notificationId, string userId)
		{
			return await _unitOfWork.Notifications.MarkAsReadAsync(notificationId, userId);
		}

		public async Task<bool> DeleteNotificationAsync(int notificationId, string userId)
		{
			var notification = await _unitOfWork.Notifications.GetAsync(
				n => n.NotificationId == notificationId && n.UserId == userId);

			if (notification == null)
				return false;

			await _unitOfWork.Notifications.DeleteAsync(notification);
			await _unitOfWork.CompleteAsync();

			return true;
		}

		public async Task<NotificationDTO> SendNotificationAsync(SendNotificationDTO notificationDto)
		{
			try
			{
				// Create notification entity
				var notification = new Notification
				{
					UserId = notificationDto.UserId,
					Message = notificationDto.Message,
					Type = notificationDto.Type,
					RelatedEntityType = notificationDto.RelatedEntityType,
					RelatedEntityId = notificationDto.RelatedEntityId,
					CreatedAt = DateTime.UtcNow,
					IsRead = false
				};

				// Save to database
				await _unitOfWork.Notifications.AddAsync(notification);
				await _unitOfWork.CompleteAsync();

				// Map to DTO
				var notificationDTO = _mapper.Map<NotificationDTO>(notification);

				// Send real-time notification via SignalR
				await _hubContext.Clients.User(notificationDto.UserId)
					.SendAsync("ReceiveNotification", notificationDTO);

				_logger.LogInformation("Notification sent to user {UserId}: {Message}",
					notificationDto.UserId, notificationDto.Message);

				return notificationDTO;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error sending notification to user {UserId}", notificationDto.UserId);
				throw;
			}
		}

		public async Task SendBookingReminderAsync(int bookingId, string userId, string childName)
		{
			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);
			if (booking == null)
			{
				_logger.LogWarning("Cannot send reminder for non-existent booking: {BookingId}", bookingId);
				return;
			}

			var reminderMessage = $"Nhắc nhở: Bạn có lịch tiêm chủng cho bé {childName} vào ngày {booking.BookingDate.ToString("dd/MM/yyyy")} lúc {booking.BookingDate.ToString("HH:mm")}. Vui lòng đưa bé đến đúng giờ.";

			var notificationDto = new SendNotificationDTO
			{
				UserId = userId,
				Message = reminderMessage,
				Type = "Reminder",
				RelatedEntityType = "Booking",
				RelatedEntityId = bookingId
			};

			await SendNotificationAsync(notificationDto);
		}

		
	}
}