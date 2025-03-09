using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Enum
{
    public enum BookingStatus
    {
        Pending = 1,           // Chờ xác nhận
        Confirmed = 2,         // Đã xác nhận
        Unassigned = 3,        // Chưa có bác sĩ được gán
        InProgress = 4,        // Đang thực hiện
        Completed = 5,         // Đã hoàn thành
        Cancelled = 6          // Đã hủy
    }
}
