using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.ComboVaccine
{
	public class UpdateComboVaccineDTO
	{
		public string ComboName { get; set; }
		public string Description { get; set; }
	//	public decimal TotalPrice { get; set; }
		public bool IsActive { get; set; }

		public List<int> VaccineIds { get; set; }
	}
}
