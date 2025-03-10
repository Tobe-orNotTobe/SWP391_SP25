﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class BookingDetail
    {
        [Key]
        public int BookingDetailId { get; set; }

        [ForeignKey("Booking")]
        public int BookingId { get; set; }
        public Booking Booking { get; set; }

        [ForeignKey("Vaccine")]
        public int? VaccineId { get; set; }
        public Vaccine Vaccine { get; set; }

        [ForeignKey("ComboVaccine")]
        public int? ComboVaccineId { get; set; }
        public ComboVaccine ComboVaccine { get; set; }

		[ForeignKey("VaccineInventory")]
		public int? VaccineInventoryId { get; set; }
		public VaccineInventory VaccineInventory { get; set; }

		[Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }
}
