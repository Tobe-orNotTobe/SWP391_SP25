using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Enum
{
    public enum BookingDetailStatus
    {
        Pending = 1,      // Chưa tiêm
        Completed = 2,    // Đã hoàn thành
        Skipped = 3,      // Bỏ qua (nếu cần)
        Cancelled = 4     // Đã hủy
    }
}

