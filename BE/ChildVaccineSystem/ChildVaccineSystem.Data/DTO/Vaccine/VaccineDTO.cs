using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Vaccine
{
	public class VaccineDTO
	{
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
        public int? IsParentId { get; set; } // ✅ Thêm thuộc tính
        public bool IsIncompatibility { get; set; } // ✅ Thêm thuộc tính
    }
}
