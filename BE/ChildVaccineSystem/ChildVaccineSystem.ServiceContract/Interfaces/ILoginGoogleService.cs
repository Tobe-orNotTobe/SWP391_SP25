using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface ILoginGoogleService
    {
        Task<object> LoginWithGoogleAsync(GoogleLoginDTO model);
    }
}
