    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO
{
    public class ComboDetailDTO
    {
        public int ComboDetailId { get; set; }
        public int ComboId { get; set; }
        public int VaccineId { get; set; }
        public string VaccineName { get; set; }  // Tên vaccine cho frontend hiển thị
    }
}
