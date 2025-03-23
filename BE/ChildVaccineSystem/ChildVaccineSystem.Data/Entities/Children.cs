using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Enum;

namespace ChildVaccineSystem.Data.Entities
{
    public class Children
    {
        [Key]
        public int ChildId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }

        public Gender Gender { get; set; }

        public string MedicalHistory { get; set; }
        public RelationToUser RelationToUser { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public string ImageUrl { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }
		public ICollection<VaccinationRecord> VaccinationRecords { get; set; }
	}


}
