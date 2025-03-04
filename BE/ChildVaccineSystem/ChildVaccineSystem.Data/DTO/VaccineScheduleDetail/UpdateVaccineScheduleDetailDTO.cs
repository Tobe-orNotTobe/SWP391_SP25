using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineScheduleDetail
{
	public class UpdateVaccineScheduleDetailDTO
	{
		[Required]
		public int VaccineId { get; set; }

		[Required]
		[MinLength(1, ErrorMessage = "At least one injection schedule is required")]
		public List<UpdateInjectionScheduleDTO> InjectionSchedules { get; set; } = new List<UpdateInjectionScheduleDTO>();
	}
}
