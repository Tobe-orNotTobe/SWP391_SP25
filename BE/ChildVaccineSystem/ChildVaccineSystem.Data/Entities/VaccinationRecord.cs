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

        [Required]
        public DateTime VaccinationDate { get; set; }


		[ForeignKey("VaccineInventory")]
		public int VaccineInventoryId { get; set; }
		public VaccineInventory VaccineInventory { get; set; }


		public int Sequence { get; set; }

        public DateTime? NextDoseDate { get; set; }

        [Required]
        public decimal DoseAmount { get; set; }
    }
}
