using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.DoctorWorkSchedule
{
    public class DoctorWorkScheduleDTO
    {
        public int BookingId { get; set; }
        public string UserId { get; set; } // ID của bác sĩ
        public string DoctorName { get; set; } // Tên bác sĩ
        public DateTime BookingDate { get; set; } // Ngày đặt lịch
        public string ChildName { get; set; } // Tên trẻ được đặt lịch
    }
}
