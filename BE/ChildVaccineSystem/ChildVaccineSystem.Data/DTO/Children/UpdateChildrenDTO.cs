using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Children
{
    public class UpdateChildrenDTO
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string MedicalHistory { get; set; }
        public string RelationToUser { get; set; }
    }
}
