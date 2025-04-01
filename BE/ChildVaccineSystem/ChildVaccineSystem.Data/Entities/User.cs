using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool IsActive { get; set; } = true;
        public string? RefreshToken { get; set; }
        public string? ImageUrl { get; set; }
        public string? CertificateImageUrl { get; set; }
        public ICollection<Children> Children { get; set; }

        public ICollection<Booking> Bookings { get; set; }

        public ICollection<Notification> Notifications { get; set; }
        public ICollection<VaccinationRecord> VaccinationRecords { get; set; }
        public ICollection<RefundRequest> RefundRequests { get; set; }

	}
}
