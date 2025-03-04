using ChildVaccineSystem.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Children
{
    public class ChildrenDTO
    {
        public int ChildId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string MedicalHistory { get; set; }
        public RelationToUser RelationToUser { get; set; } // Dùng Enum

        public double Height { get; set; }
        public double Weight { get; set; }
        public string ImageUrl { get; set; }
        public string UserId { get; set; }
    }

}
