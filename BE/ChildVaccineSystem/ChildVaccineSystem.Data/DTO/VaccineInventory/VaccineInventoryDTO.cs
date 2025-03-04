using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineInventory
{
    public class VaccineInventoryDTO
    {
        public int VaccineInventoryId { get; set; }
        public int VaccineId { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string BatchNumber { get; set; }
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Supplier { get; set; }
        public int InitialQuantity { get; set; }
        public int QuantityInStock { get; set; }
        public int ReturnedQuantity { get; set; }
        public int TotalQuantity { get; set; }
        public bool Status => ExpiryDate >= DateTime.UtcNow;
    }
}

