using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Auth
{
    public class LoginResponseDTO
    {
        //public UserDTO User { get; set; }
        public string Token { get; set; }
        public string RefeshToken { get; set; }
        //public IEnumerable<string> Role { get; set; }
    }
}
