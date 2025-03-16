using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
	public class ReminderService : IReminderService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly INotificationService _notificationService;
		private readonly ILogger<ReminderService> _logger;

		public ReminderService(
			IUnitOfWork unitOfWork,
			INotificationService notificationService,
			ILogger<ReminderService> logger)
		{
			_unitOfWork = unitOfWork;
			_notificationService = notificationService;
			_logger = logger;
		}

		public async Task ProcessAppointmentRemindersAsync(int daysThreshold)
		{
			_logger.LogInformation("Processing appointment reminders for bookings {0} days ahead", daysThreshold);

			// 1. Xử lý các reminder đã tạo trước đó và đến hạn gửi
			await ProcessScheduledRemindersAsync();

			// 2. Tìm các booking sắp tới và tạo reminder nếu chưa có
			await CreateRemindersForUpcomingBookingsAsync(daysThreshold);
		}

		private async Task ProcessScheduledRemindersAsync()
		{
			try
			{
				var dueReminders = await _unitOfWork.VaccinationReminders.GetDueRemindersAsync();

				_logger.LogInformation("Found {Count} due reminders to process", dueReminders?.Count() ?? 0);

				foreach (var reminder in dueReminders)
				{
					try
					{
						_logger.LogInformation("Sending reminder for booking ID: {0}", reminder.BookingId);

						var childName = reminder.Children?.FullName ?? "your child";

						// Gửi thông báo qua notification service
						await _notificationService.SendBookingReminderAsync(
							reminder.BookingId,
							reminder.UserId,
							childName);

						// Đánh dấu đã gửi
						reminder.IsSent = true;
						await _unitOfWork.CompleteAsync();

						_logger.LogInformation("Reminder sent successfully for booking ID: {0}", reminder.BookingId);
					}
					catch (Exception ex)
					{
						_logger.LogError(ex, "Error sending reminder for booking ID: {0}", reminder.BookingId);
					}
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error processing scheduled reminders");
				throw;
			}
		}

		private async Task CreateRemindersForUpcomingBookingsAsync(int daysThreshold)
		{
			try
			{
				var upcomingBookings = await _unitOfWork.VaccinationReminders.GetUpcomingBookingsForRemindersAsync(daysThreshold);

				_logger.LogInformation("Found {Count} upcoming bookings to create reminders for", upcomingBookings?.Count() ?? 0);

				foreach (var booking in upcomingBookings)
				{
					try
					{
						// Kiểm tra xem đã có reminder cho booking này chưa
						bool hasReminder = await _unitOfWork.VaccinationReminders.HasReminderForBookingAsync(booking.BookingId);

						if (!hasReminder)
						{
							_logger.LogInformation("Creating reminder for upcoming booking ID: {0}", booking.BookingId);
							await CreateReminderForBookingAsync(booking.BookingId);
						}
					}
					catch (Exception ex)
					{
						_logger.LogError(ex, "Error creating reminder for booking ID: {0}", booking.BookingId);
					}
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating reminders for upcoming bookings");
				throw;
			}
		}

		public async Task CreateReminderForBookingAsync(int bookingId)
		{
			try
			{
				var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId,
					includeProperties: "Children,User,BookingDetails.Vaccine,BookingDetails.ComboVaccine");

				if (booking == null)
				{
					_logger.LogWarning("Booking not found for ID: {0}", bookingId);
					return;
				}

				// Tính ngày gửi reminder (3 ngày trước ngày hẹn)
				DateTime reminderDate = booking.BookingDate.AddDays(-3);

				// Nếu ngày gửi reminder đã qua, đặt là ngày hôm nay
				if (reminderDate < DateTime.Today)
				{
					reminderDate = DateTime.Today;
				}

				// Tạo reminder
				var reminder = new VaccinationReminder
				{
					UserId = booking.UserId,
					ChildId = booking.ChildId,
					BookingId = booking.BookingId,
					ReminderDate = reminderDate,
					IsSent = false
				};

				await _unitOfWork.VaccinationReminders.AddAsync(reminder);
				await _unitOfWork.CompleteAsync();

				_logger.LogInformation("Reminder created for booking ID: {0}, scheduled for: {1}",
					booking.BookingId, reminderDate.ToShortDateString());
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating reminder for booking: {BookingId}", bookingId);
				throw;
			}
		}
	}
}