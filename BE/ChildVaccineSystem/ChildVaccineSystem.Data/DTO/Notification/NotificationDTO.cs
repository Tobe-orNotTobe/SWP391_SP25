using System;
using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.DTO.Notification
{
	public class NotificationDTO
	{
		public int NotificationId { get; set; }
		public string UserId { get; set; }
		public string Message { get; set; }
		public DateTime CreatedAt { get; set; }
		public bool IsRead { get; set; }
		public string Type { get; set; }
		public string? RelatedEntityType { get; set; }
		public int? RelatedEntityId { get; set; }
	}

	public class SendNotificationDTO
	{
		[Required]
		public string UserId { get; set; }

		[Required]
		[StringLength(500, MinimumLength = 5)]
		public string Message { get; set; }

		[Required]
		public string Type { get; set; } //System, Admin

		public string? RelatedEntityType { get; set; }  //Booking, Reminder,..

		public int? RelatedEntityId { get; set; }
	}

	public class BroadcastNotificationDTO
	{
		[Required]
		[StringLength(500, MinimumLength = 5)]
		public string Message { get; set; }
	}

	public class UpdateNotificationDTO
	{
		[StringLength(500, MinimumLength = 5)]
		public string? Message { get; set; }

		public string? Type { get; set; }

		public string? RelatedEntityType { get; set; }

		public int? RelatedEntityId { get; set; }
	}

	public class AdminNotificationDTO
	{
		public int NotificationId { get; set; }
		public string UserId { get; set; }
		public string UserName { get; set; }
		public string UserEmail { get; set; }
		public string Message { get; set; }
		public DateTime CreatedAt { get; set; }
		public bool IsRead { get; set; }
		public string Type { get; set; }
		public string? RelatedEntityType { get; set; }
		public int? RelatedEntityId { get; set; }
	}
}