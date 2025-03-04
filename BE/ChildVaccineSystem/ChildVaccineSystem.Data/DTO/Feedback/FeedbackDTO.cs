using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Feedback
{
    public class FeedbackDTO
    {
        public int FeedbackId { get; set; }
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public string? UserName { get; set; }  // Tên người dùng
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime DateSubmitted { get; set; }
    }

}
