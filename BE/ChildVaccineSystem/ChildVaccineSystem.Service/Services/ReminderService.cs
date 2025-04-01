using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
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

			// 1. Clean up expired reminders (reminders for dates that have already passed)
			await CleanupExpiredRemindersAsync();

			// 2. Process scheduled reminders that are due today
			await ProcessScheduledRemindersAsync();

			// 3. Find valid upcoming bookings and create reminders if needed
			await CreateRemindersForUpcomingBookingsAsync(daysThreshold);
		}

		private async Task CleanupExpiredRemindersAsync()
		{
			try
			{
				var currentDate = DateTime.Today;
				// Get all reminders for bookings with dates that have already passed
				var expiredReminders = await _unitOfWork.VaccinationReminders.GetAllAsync(
					r => r.Booking.BookingDate.Date < currentDate,
					includeProperties: "Booking"
				);

				_logger.LogInformation("Found {Count} expired reminders to clean up", expiredReminders?.Count() ?? 0);

				foreach (var reminder in expiredReminders)
				{
					try
					{
						await _unitOfWork.VaccinationReminders.DeleteAsync(reminder);
						_logger.LogInformation("Deleted expired reminder for booking ID: {0}", reminder.BookingId);
					}
					catch (Exception ex)
					{
						_logger.LogError(ex, "Error deleting expired reminder for booking ID: {0}", reminder.BookingId);
					}
				}

				await _unitOfWork.CompleteAsync();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error cleaning up expired reminders");
			}
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
						// Check if the booking is still valid (Confirmed or InProgress)
						if (reminder.Booking.Status != BookingStatus.Confirmed &&
							reminder.Booking.Status != BookingStatus.InProgress)
						{
							// Skip reminders for bookings that are no longer valid
							await _unitOfWork.VaccinationReminders.DeleteAsync(reminder);
							continue;
						}

						_logger.LogInformation("Sending reminder for booking ID: {0}", reminder.BookingId);

						var childName = reminder.Children?.FullName ?? "your child";

						// Send notification
						await _notificationService.SendBookingReminderAsync(
							reminder.BookingId,
							reminder.UserId,
							childName);

						// Mark as sent
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
			}
		}

		private async Task CreateRemindersForUpcomingBookingsAsync(int daysThreshold)
		{
			try
			{
				// Get bookings for the target date that are Confirmed or InProgress
				var targetDate = DateTime.Now.AddDays(daysThreshold);
				var upcomingBookings = await _unitOfWork.Bookings.GetAllAsync(
					b => b.BookingDate.Date == targetDate.Date &&
						 (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.InProgress),
					includeProperties: "Children,User"
				);

				_logger.LogInformation("Found {Count} valid upcoming bookings for creating reminders", upcomingBookings?.Count() ?? 0);

				foreach (var booking in upcomingBookings)
				{
					try
					{
						// Check if this booking already has a reminder
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
					includeProperties: "Children,User");

				if (booking == null)
				{
					_logger.LogWarning("Booking not found for ID: {0}", bookingId);
					return;
				}

				// Don't create reminders for bookings that aren't confirmed or in progress
				if (booking.Status != BookingStatus.Confirmed && booking.Status != BookingStatus.InProgress)
				{
					_logger.LogInformation("Skipping reminder creation for booking {0} with status {1}",
						bookingId, booking.Status);
					return;
				}

				// Calculate reminder date (should be sent 3 days before the appointment)
				DateTime reminderDate = booking.BookingDate.AddDays(-3);

				// If booking date is less than 3 days away, set reminder for today
				if (reminderDate < DateTime.Today)
				{
					reminderDate = DateTime.Today;
				}

				// Create reminder
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