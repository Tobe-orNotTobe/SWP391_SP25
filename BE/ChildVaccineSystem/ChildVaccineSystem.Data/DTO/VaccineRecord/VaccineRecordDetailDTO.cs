using ChildVaccineSystem.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.VaccineRecord
{
    public class VaccineRecordDetailDTO
    {
		public int VaccinationRecordId { get; set; }
		public string VaccineName { get; set; }
        public decimal DoseAmount { get; set; }
        public decimal Price { get; set; }
        public DateTime? NextDoseDate { get; set; }
        public string BatchNumber { get; set; }

        public string Status => StatusEnum.ToString();

        [JsonIgnore]
        public VaccineRecordStatus StatusEnum { get; set; }

        public string Notes { get; set; }
    }
}
