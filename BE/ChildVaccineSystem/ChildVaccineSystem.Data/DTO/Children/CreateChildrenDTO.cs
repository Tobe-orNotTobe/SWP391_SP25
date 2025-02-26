using ChildVaccineSystem.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Children
{
    public class CreateChildrenDTO
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }

        public Gender Gender { get; set; } 

        public string MedicalHistory { get; set; }
        public RelationToUser RelationToUser { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public string ImageUrl { get; set; }
    }

}
