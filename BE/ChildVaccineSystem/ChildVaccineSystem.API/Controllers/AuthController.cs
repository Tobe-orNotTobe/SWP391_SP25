using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.DTO.Category;
using ChildVaccineSystem.Data.DTO.Email;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;
		private readonly APIResponse _response;
		private readonly UserManager<User> _userManager;
		private readonly IWalletService _walletService;
        private readonly ILoginGoogleService _loginGoogleService;

        public AuthController(IAuthService authService, APIResponse response, UserManager<User> userManager, IWalletService walletService, ILoginGoogleService loginGoogleService)
		{
			_authService = authService;
			_response = response;
			_userManager = userManager;
			_walletService = walletService;
            _loginGoogleService = loginGoogleService;
        }

		[AllowAnonymous]
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegisterDTO dto)
		{
			try
			{
				var user = await _authService.RegisterAsync(dto);
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = new { Message = "Đăng ký thành công. Vui lòng xác nhận email của bạn." };
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
		}

		[HttpPost("confirm-email")]
		//[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest model)
		{
			try
			{
				var result = await _authService.ConfirmEmailAsync(model.Email, model.Token);

				// Check for success and handle different cases
				if (!result)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Token không hợp lệ hoặc đã hết hạn.");
					return BadRequest(_response);
				}
				var user = await _userManager.FindByEmailAsync(model.Email);
				await _walletService.CreateWalletAsync(user.Id, isAdminWallet: false);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = new { Message = "Email đã được xác nhận thành công." };
				return Ok(_response);
			}
			catch (Exception ex)
			{
				// Handling exception for already confirmed email
				if (ex.Message == "Email đã được xác nhận.")
				{
					_response.StatusCode = HttpStatusCode.OK;
					_response.IsSuccess = false;
					_response.Result = new { Message = "Email đã được xác nhận." };
					return Ok(_response);
				}

				// Handle other exceptions
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
		}

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
		{
			try
			{
				var result = await _authService.LoginAsync(loginRequestDTO);
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = result;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return Unauthorized(_response);
			}
		}

		[AllowAnonymous]
		[HttpPost("refresh-token")]
		public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO model)
		{
			// Kiểm tra nếu RefreshToken không có trong yêu cầu
			if (string.IsNullOrWhiteSpace(model.RefreshToken))
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add("Cần phải có Refresh token làm mới.");
				return BadRequest(_response);
			}

			try
			{
				// Gọi dịch vụ để làm mới token
				var result = await _authService.RefreshTokenAsync(model.RefreshToken);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = result;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
		}

		[AllowAnonymous]
		[HttpPost("forget-password")]
		public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordRequestDTO model)
		{
			if (string.IsNullOrWhiteSpace(model.Email))
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add("Cần phải có Email.");
				return BadRequest(_response);
			}

			try
			{
				await _authService.ForgetPasswordAsync(model.Email);
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = new { Message = "Đã gửi liên kết đặt lại mật khẩu." };
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
		}

		[AllowAnonymous]
		[HttpPost("reset-password")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Cần phải nhập Email, Token và Mật khẩu mới.");
					return BadRequest(_response);
				}

				var (success, message) = await _authService.ResetPasswordAsync(dto.Email, dto.Token, dto.NewPassword);

				if (!success)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add(message);
					return BadRequest(_response);
				}

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = new { Success = true, Message = message };
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi hệ thống {ex.Message}");
				return BadRequest(_response);
			}
		}

        [HttpPost("login-google")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDTO model)
        {
            try
            {
                var result = await _loginGoogleService.LoginWithGoogleAsync(model);

                if (result == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy tài khoản hợp lệ.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = result;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return NotFound(_response);
            }
        }


    }
}

