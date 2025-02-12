using AutoMapper;
using ChildVaccineSystem.Data.DTO;
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
                throw new Exception("Invalid username or password!");

            if (!user.EmailConfirmed)
                throw new Exception("Email is not confirmed. Please confirm your email to login.");

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            return new LoginResponseDTO
            {
                Token = token,
            };
        }


        public async Task<User> RegisterAsync(UserRegisterDTO dto)
        {
            // Validate if email is null or empty
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                throw new Exception("Invalid email address.");

            // Validate if username is null or empty
            if (string.IsNullOrWhiteSpace(dto.UserName))
                throw new Exception("Username cannot be empty.");

            // Validate phone number format
            if (string.IsNullOrWhiteSpace(dto.PhoneNumber) || !IsValidPhoneNumber(dto.PhoneNumber))
                throw new Exception("Invalid phone number format. Phone number must start with 0 and be at most 10 digits long.");

            // Check if email already exists
            var userExists = await _userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
                throw new Exception("Email already exists.");

            // Check if username already exists
            var usernameExists = await _userManager.FindByNameAsync(dto.UserName);
            if (usernameExists != null)
                throw new Exception("Username already exists.");

            // Check if phone number already exists
            var phoneExists = await _userManager.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber);
            if (phoneExists)
                throw new Exception("Phone number already exists.");

            // Validate password complexity (at least 6 characters as an example)
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                throw new Exception("Password must be at least 6 characters long, including at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 numeric character.");

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
                throw new Exception($"User registration failed: {errors}");
            }

            // Check if "Customer" role exists, if not, create it
            if (!await _roleManager.RoleExistsAsync(defaultRole))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(defaultRole));
                if (!roleResult.Succeeded)
                {
                    var roleErrors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                    throw new Exception($"Role creation failed: {roleErrors}");
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
                throw new Exception("User not found.");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result.Succeeded;
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken)
        {
            // Mock logic to validate the refresh token
            var user = await _userManager.FindByIdAsync(refreshToken); // Ensure to change this as per your storage logic
            if (user == null)
                throw new Exception("Invalid refresh token.");

            var newToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            return new LoginResponseDTO
            {
                Token = newToken,
            };
        }

        public async Task<bool> ForgetPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new Exception("User not found.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"{_configuration["AppSettings:FrontendUrl"]}/reset-password?email={email}&token={token}";

            await _emailService.SendEmailForgotPassword(email, resetLink);

            return true;
        }


        public async Task<(bool Success, string Message)> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, "User not found.");
            }

            var resetResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!resetResult.Succeeded)
            {
                // Capture detailed error messages
                var errors = string.Join("; ", resetResult.Errors.Select(e => e.Description));
                return (false, $"Password reset failed: {errors}");
            }

            return (true, "Password has been reset successfully.");
        }


        private string GenerateJwtToken(User user)
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
