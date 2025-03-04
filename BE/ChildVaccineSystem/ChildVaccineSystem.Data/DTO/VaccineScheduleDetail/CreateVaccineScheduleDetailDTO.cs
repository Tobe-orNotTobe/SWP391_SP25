using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineScheduleDetail
{
	public class CreateVaccineScheduleDetailDTO
	{
		[Required]
		public int VaccineId { get; set; }

		[Required]
		public List<CreateInjectionScheduleDTO> InjectionSchedules { get; set; } = new List<CreateInjectionScheduleDTO>();
	}
}
