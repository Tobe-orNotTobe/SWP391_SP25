using AutoMapper;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ChildVaccineSystem.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public AuthService(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IMapper mapper,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequestDTO)
        {
            var user = await _userManager.FindByEmailAsync(loginRequestDTO.Username);
            if (user == null)
            {
                user = await _userManager.FindByNameAsync(loginRequestDTO.Username);
            }

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password))
                throw new Exception("Tên người dùng hoặc mật khẩu không hợp lệ!");

            if (!user.EmailConfirmed)
                throw new Exception("Email chưa được xác nhận. Vui lòng xác nhận email của bạn để đăng nhập.");

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            await _userManager.UpdateAsync(user);

            return new LoginResponseDTO
            {
                Token = token,
                RefeshToken = refreshToken
            };
        }


        public async Task<User> RegisterAsync(UserRegisterDTO dto)
        {
            // Validate if email is null or empty
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                throw new Exception("Địa chỉ email không hợp lệ.");

            // Validate if username is null or empty
            if (string.IsNullOrWhiteSpace(dto.UserName))
                throw new Exception("Tên người dùng không được để trống.");

            // Validate phone number format
            if (string.IsNullOrWhiteSpace(dto.PhoneNumber) || !IsValidPhoneNumber(dto.PhoneNumber))
                throw new Exception("Định dạng số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và dài tối đa 10 chữ số.");

            // Check if email already exists
            var userExists = await _userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
                throw new Exception("Email đã tồn tại.");

            // Check if username already exists
            var usernameExists = await _userManager.FindByNameAsync(dto.UserName);
            if (usernameExists != null)
                throw new Exception("Tên người dùng đã tồn tại.");

            // Check if phone number already exists
            var phoneExists = await _userManager.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber);
            if (phoneExists)
                throw new Exception("Số điện thoại đã tồn tại.");

            // Validate password complexity (at least 6 characters as an example)
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                throw new Exception("Mật khẩu phải dài ít nhất 6 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 ký tự đặc biệt và 1 số.");

            // Assign default role as "Customer"
            string defaultRole = "Customer";

            // Map DTO to User entity
            var user = _mapper.Map<User>(dto);

            // Set the default role to "Customer"
            user.PhoneNumber = dto.PhoneNumber; // Ensure phone number is saved
            user.UserName = dto.UserName;
            user.Email = dto.Email;

            // Attempt to create the user
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new Exception($"Đăng ký người dùng không thành công: {errors}");
            }

            // Check if "Customer" role exists, if not, create it
            if (!await _roleManager.RoleExistsAsync(defaultRole))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(defaultRole));
                if (!roleResult.Succeeded)
                {
                    var roleErrors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                    throw new Exception($"Tạo vai trò không thành công: {roleErrors}");
                }
            }

            // Assign role "Customer" to the user
            await _userManager.AddToRoleAsync(user, defaultRole);

            // Generate confirmation email token and send email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmLink = $"{_configuration["AppSettings:FrontendUrl"]}/confirm-email?email={user.Email}&token={token}";
            _emailService.SendEmailConfirmation(user.Email, confirmLink);

            return user;
        }

        // Method to validate phone number
        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Phone number must start with '0' and be exactly 10 digits long
            return phoneNumber.Length <= 10 && phoneNumber.StartsWith("0") && phoneNumber.All(char.IsDigit);
        }



        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new Exception("Không tìm thấy người dùng.");

            // Check if the email is already confirmed
            if (user.EmailConfirmed)
            {
                throw new Exception("Email đã được xác nhận.");
            }

            string decodedToken = Uri.UnescapeDataString(token).Replace(" ", "+");

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new Exception($"Xác nhận email không thành công: {errors}");
            }

            return result.Succeeded;
        }


        public async Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken)
        {
            // Tìm người dùng thông qua refreshToken (refreshToken được lưu trữ trong cơ sở dữ liệu)
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null)
                throw new Exception("Refresh Token không hợp lệ.");

            // Tạo lại access token và refresh token mới
            var newToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Cập nhật refresh token mới cho người dùng trong cơ sở dữ liệu
            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            // Trả về thông tin bao gồm token mới và refresh token mới
            return new LoginResponseDTO
            {
                Token = newToken,
                RefeshToken = newRefreshToken
            };
        }


        public async Task<bool> ForgetPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new Exception("Không tìm thấy người dùng.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            string decodedToken = Uri.UnescapeDataString(token)
                .Replace(" ", "+");

            var resetLink = $"{_configuration["AppSettings:FrontendUrl"]}/reset-password?email={email}&token={token}";

            await _emailService.SendEmailForgotPassword(email, resetLink);

            return true;
        }


        public async Task<(bool Success, string Message)> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, "Không tìm thấy người dùng.");
            }

            var resetResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!resetResult.Succeeded)
            {
                // Capture detailed error messages
                var errors = string.Join("; ", resetResult.Errors.Select(e => e.Description));
                return (false, $"Đặt lại mật khẩu không thành công: {errors}");
            }

            return (true, "Mật khẩu đã được đặt lại thành công.");
        }


        public string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        public Task LogoutAsync(string refreshToken)
        {
            return Task.CompletedTask;
        }


    }
}
