using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.ComboVaccine
{
    public class UpdateComboVaccineDTO
    {
        public string? ComboName { get; set; }
        public string? Description { get; set; }
        public decimal? TotalPrice { get; set; }
        public bool IsActive { get; set; }

        public List<UpdateComboDetailDTO> Vaccines { get; set; }
    }

    public class UpdateComboDetailDTO
    {
        public int VaccineId { get; set; }
        public int Order { get; set; }
        public int IntervalDays { get; set; }
    }

}
