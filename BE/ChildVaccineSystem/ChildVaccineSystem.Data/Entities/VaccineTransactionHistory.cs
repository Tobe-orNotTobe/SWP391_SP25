using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class VaccineTransactionHistory
    {
        public int Id { get; set; }
        public int VaccineInventoryId { get; set; }

        public string TransactionType { get; set; }
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Description { get; set; }

        public virtual VaccineInventory VaccineInventory { get; set; }
    }
}
