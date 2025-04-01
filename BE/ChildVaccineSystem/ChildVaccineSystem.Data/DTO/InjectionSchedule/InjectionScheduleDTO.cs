using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.InjectionSchedule
{
	public class InjectionScheduleDTO
	{
		public int InjectionNumber { get; set; }
		public int InjectionMonth { get; set; }

		public bool IsRequired { get; set; }
		public string Notes { get; set; }
	}
}
