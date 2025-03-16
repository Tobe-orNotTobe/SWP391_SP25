using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;

public class LoginGoogleService : ILoginGoogleService
{
    private readonly UserManager<User> _userManager;
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public LoginGoogleService(UserManager<User> userManager, IAuthService authService, IConfiguration configuration)
    {
        _userManager = userManager;
        _authService = authService;
        _configuration = configuration;
    }

    public async Task<(bool Success, string Message, string Token, User User)> LoginWithGoogleAsync(string idToken)
    {
        try
        {
            // ✅ Xác thực ID Token với Google
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["Authentication:Google:ClientId"] }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            if (payload == null)
            {
                return (false, "Xác thực Google thất bại.", null, null);
            }

            // 🔍 Kiểm tra xem người dùng đã tồn tại chưa
            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                // 🆕 Nếu chưa có, tạo user mới
                user = new User
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    EmailConfirmed = true,
                    FullName = payload.Name
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return (false, "Lỗi khi tạo tài khoản mới.", null, null);
                }

                // Gán quyền mặc định cho tài khoản mới
                await _userManager.AddToRoleAsync(user, "Customer");
            }

            // 🎟️ Tạo JWT Token để trả về cho frontend
            var token = _authService.GenerateJwtToken(user);

            return (true, "Đăng nhập thành công.", token, user);
        }
        catch (Exception ex)
        {
            return (false, $"Lỗi hệ thống: {ex.Message}", null, null);
        }
    }
}
