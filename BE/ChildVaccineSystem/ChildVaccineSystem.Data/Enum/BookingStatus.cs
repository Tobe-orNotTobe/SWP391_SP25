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
        InProgress = 3,        // Đang thực hiện
        Completed = 4,         // Đã hoàn thành
        Cancelled = 5,          // Đã hủy
        RequestRefund = 6       // Yêu cầu hoàn tiền
	}
}
