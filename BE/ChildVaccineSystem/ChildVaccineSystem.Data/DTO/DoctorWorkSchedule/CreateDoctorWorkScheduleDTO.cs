using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.DoctorWorkSchedule
{
    public class CreateDoctorWorkScheduleDTO
    {
        public int BookingId { get; set; }
        public string UserId { get; set; } // ID của bác sĩ
    }
}
