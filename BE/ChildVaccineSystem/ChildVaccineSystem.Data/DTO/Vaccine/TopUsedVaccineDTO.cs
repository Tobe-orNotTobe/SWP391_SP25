using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Vaccine
{
    public class TopUsedVaccineDTO
    {
        public int VaccineId { get; set; }
        public string VaccineName { get; set; }
        public int Count { get; set; }
    }

}
