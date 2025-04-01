using ChildVaccineSystem.Data.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChildVaccineSystem.Data.Entities
{
    public class VaccinationRecord
    {
        [Key]
        public int VaccinationRecordId { get; set; }

        [ForeignKey("BookingDetail")]
        public int BookingDetailId { get; set; }
        public BookingDetail BookingDetail { get; set; }

		[ForeignKey("User")]
        public string UserId { get; set; }
		public User User { get; set; }

		[ForeignKey("Children")]
		public int ChildId { get; set; }
		public Children Child { get; set; }

		[ForeignKey("Vaccine")]
		public int VaccineId { get; set; }
		public Vaccine Vaccine { get; set; }

		[Required]
        public DateTime VaccinationDate { get; set; } = DateTime.UtcNow;


		[ForeignKey("VaccineInventory")]
		public int VaccineInventoryId { get; set; }
		public VaccineInventory VaccineInventory { get; set; }

		[Required]
		public decimal DoseAmount { get; set; }

		public int Sequence { get; set; } = 1;

		public DateTime? NextDoseDate { get; set; } = null;

		public VaccineRecordStatus Status { get; set; } = VaccineRecordStatus.Pending;

		public string Notes { get; set; } = string.Empty;

		public string BatchNumber { get; set; } = string.Empty;
		public decimal Price { get; set; }

		public Reaction Reaction { get; set; }

	}
}
