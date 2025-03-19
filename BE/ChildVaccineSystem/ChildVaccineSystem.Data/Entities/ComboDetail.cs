using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class ComboDetail
    {
        [Key]
        public int ComboDetailId { get; set; }

        [ForeignKey("ComboVaccine")]
        public int ComboId { get; set; }
        public ComboVaccine ComboVaccine { get; set; }

        [ForeignKey("Vaccine")]
        public int VaccineId { get; set; }
        public Vaccine Vaccine { get; set; }

		[ForeignKey("VaccineInventory")]
		public int? VaccineInventoryId { get; set; }
		public VaccineInventory VaccineInventory { get; set; }
        // Thêm thứ tự và khoảng cách giữa các vaccine
        public int Order { get; set; } // Thứ tự tiêm
        public int IntervalDays { get; set; } // Khoảng cách giữa các lần tiêm (tính theo ngày)
    }
}
