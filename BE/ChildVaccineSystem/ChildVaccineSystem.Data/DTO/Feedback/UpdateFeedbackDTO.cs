using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Feedback
{
    public class UpdateFeedbackDTO
    {
        [Required]
        public int Rating { get; set; }

        public string Comment { get; set; }
    }

}
