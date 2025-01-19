using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class ComboVaccine
    {
        [Key]
        public int ComboId { get; set; }
        public string ComboName { get; set; }
        public string Description { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsActive { get; set; }
        public int ValidityMonths { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime CreatedAtUpdatedAt { get; set; }
    }

}
