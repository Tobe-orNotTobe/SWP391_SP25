using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineInventory
{
    public class UpdateVaccineInventoryDTO
    {
        public string? BatchNumber { get; set; }
        public DateTime? ManufacturingDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? InitialQuantity { get; set; }
        public string? Supplier { get; set; }
    }
}
