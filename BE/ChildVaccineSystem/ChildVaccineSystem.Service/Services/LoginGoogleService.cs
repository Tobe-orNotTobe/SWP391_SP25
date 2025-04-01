using System;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Identity;

namespace ChildVaccineSystem.Service.Services
{
    public class LoginGoogleService : ILoginGoogleService
    {
        private readonly UserManager<User> _userManager;
        private readonly IAuthService _authService;

        public LoginGoogleService(UserManager<User> userManager, IAuthService authService)
        {
            _userManager = userManager;
            _authService = authService;
        }

        public async Task<object> LoginWithGoogleAsync(GoogleLoginDTO model)
        {
            try
            {
                // Xác thực ID Token từ Firebase
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(model.IdToken);
                var uid = decodedToken.Uid;

                // Kiểm tra xem người dùng đã có trong hệ thống chưa
                var user = await _userManager.FindByIdAsync(uid);
                if (user == null)
                {
                    // Nếu chưa có, tạo user mới
                    user = new User
                    {
                        Id = uid,
                        UserName = decodedToken.Claims["email"].ToString(),
                        Email = decodedToken.Claims["email"].ToString(),
                        EmailConfirmed = true
                    };

                    await _userManager.CreateAsync(user);
                }
                await _userManager.AddToRoleAsync(user, "Customer");

                // Tạo JWT Token
                var token = _authService.GenerateJwtToken(user);

                return new
                {
                    Token = token
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Invalid token", ex);
            }
        }
    }
}
