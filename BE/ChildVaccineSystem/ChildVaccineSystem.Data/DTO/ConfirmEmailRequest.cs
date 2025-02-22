using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO
{
    public class ConfirmEmailRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
