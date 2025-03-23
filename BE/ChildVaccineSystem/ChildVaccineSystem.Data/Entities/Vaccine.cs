using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class Vaccine
    {
        [Key]
        public int VaccineId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Manufacturer { get; set; }
        public string SideEffect { get; set; }
        public string DiseasePrevented { get; set; }
        public decimal Price { get; set; }
        public bool Status { get; set; }
        public bool IsNecessary { get; set; }
        public string Image { get; set; }
        public string InjectionSite { get; set; }
        public string Notes { get; set; }
        public string VaccineInteractions { get; set; }
        public string UndesirableEffects { get; set; }
        public string Preserve { get; set; }
        public int InjectionsCount { get; set; }
		public decimal DoseAmount { get; set; }

		public int? IsParentId { get; set; } // Vaccine phải tiêm trước (nullable)

		[ForeignKey("IsParentId")]
		public virtual Vaccine? ParentVaccine { get; set; }
		public virtual ICollection<Vaccine> ChildVaccines { get; set; }

		public bool IsIncompatibility { get; set; } // Nếu true, vaccine này không thể tiêm chung với vaccine sống khác

		public virtual ICollection<VaccineScheduleDetail> VaccineScheduleDetails { get; set; }

	}
}
