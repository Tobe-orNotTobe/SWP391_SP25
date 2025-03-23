using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Enum
{
	public enum VaccineRecordStatus
	{
		Pending,   // Chờ tiêm
		Completed, // Đã tiêm
		Canceled,  // Đã hủy
		Deleted  // Xóa 
	}
}
