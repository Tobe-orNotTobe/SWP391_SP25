using ChildVaccineSystem.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineRecord
{
    public class UpdateVaccineRecordDTO
    {
        public string? Notes { get; set; }
        public VaccineRecordStatus? Status { get; set; }
        public DateTime? NextDoseDate { get; set; }
    }
}
