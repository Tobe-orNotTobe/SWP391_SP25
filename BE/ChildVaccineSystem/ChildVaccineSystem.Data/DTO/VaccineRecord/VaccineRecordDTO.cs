using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineRecord
{
    public class VaccineRecordDTO
    {
        public int BookingId { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public double? Height { get; set; }
        public double? Weight { get; set; }

        public List<VaccineRecordDetailDTO> VaccineRecords { get; set; } = new List<VaccineRecordDetailDTO>();

        public string Message { get; set; } = "Vaccine record processed successfully";
    }
}
