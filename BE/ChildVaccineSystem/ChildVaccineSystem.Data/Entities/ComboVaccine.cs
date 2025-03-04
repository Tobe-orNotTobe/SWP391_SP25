using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Entities
{
    public class ComboVaccine
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ComboId { get; set; }
        public string ComboName { get; set; }
        public string Description { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAtUpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ComboDetail> ComboDetails { get; set; } = new List<ComboDetail>();

    }

}
