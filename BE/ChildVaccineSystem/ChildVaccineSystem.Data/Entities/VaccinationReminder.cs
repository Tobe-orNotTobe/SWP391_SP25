using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
	public class VaccinationReminder
	{
		[Key]
		public int ReminderId { get; set; }

		[ForeignKey("User")]
		public string UserId { get; set; }
		public User User { get; set; }

		[ForeignKey("Children")]
		public int ChildId { get; set; }
		public Children Children { get; set; }

		[ForeignKey("Booking")]
		public int BookingId { get; set; }
		public Booking Booking { get; set; }

		public DateTime ReminderDate { get; set; }

		public bool IsSent { get; set; } = false;

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}