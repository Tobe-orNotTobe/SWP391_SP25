using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Vaccine
{
    public class VaccineStockDTO
    {
        public int VaccineId { get; set; }
        public string? Name { get; set; }
        public string? Manufacturer { get; set; }
        public bool Status { get; set; }
        public int TotalQuantity { get; set; } 
    }
}
