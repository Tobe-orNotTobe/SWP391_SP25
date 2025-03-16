using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequestDTO);
        Task<User> RegisterAsync(UserRegisterDTO dto);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task<LoginResponseDTO> RefreshTokenAsync(string token);
        Task LogoutAsync(string refreshToken);
        Task<bool> ForgetPasswordAsync(string email);
        Task<(bool Success, string Message)> ResetPasswordAsync(string email, string token, string newPassword);
        string GenerateJwtToken(User user);
    }
}
