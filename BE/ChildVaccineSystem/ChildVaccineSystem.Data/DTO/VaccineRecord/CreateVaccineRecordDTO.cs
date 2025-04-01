using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineRecord
{
    public class CreateVaccineRecordDTO
    {
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public int ChildId { get; set; }
        public int VaccineId { get; set; }
        public int VaccineInventoryId { get; set; }
        public decimal DoseAmount { get; set; }
        public int Sequence { get; set; }
        public DateTime? NextDoseDate { get; set; }
        public string Notes { get; set; }
    }
}
