using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class PricingPolicy
    {
        [Key]
        public int PricingPolicyId { get; set; }

        public int WaitTimeRangeStart { get; set; }
        public int WaitTimeRangeEnd { get; set; }

        public decimal DiscountPercent { get; set; }
    }

}
