using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
	public class Notification
	{
		[Key]
		public int NotificationId { get; set; }

		[Required]
		public string Message { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		[Required]
		public bool IsRead { get; set; } = false;

		[Required]
		public string Type { get; set; } = "System";

		public string? RelatedEntityType { get; set; }

		public int? RelatedEntityId { get; set; }

		[ForeignKey("User")]
		public string UserId { get; set; }

		public User User { get; set; }

	}

}