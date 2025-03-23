using ChildVaccineSystem.Data.DTO.Vaccine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.ComboVaccine
{
    public class ComboVaccineDTO
    {
        public int ComboId { get; set; }
        public string ComboName { get; set; }
        public string Description { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsActive { get; set; }

        public List<ComboDetailDTO> Vaccines { get; set; }
    }

    public class ComboDetailDTO
    {
        public int Order { get; set; }
        public int IntervalDays { get; set; }

        // Dùng DTO cơ bản để hiển thị chi tiết vaccine
        public VaccineBasicDTO Vaccine { get; set; }
    }

}

