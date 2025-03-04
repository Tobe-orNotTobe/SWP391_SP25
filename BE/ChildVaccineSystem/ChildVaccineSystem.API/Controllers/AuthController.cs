using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.DTO.Category;
using ChildVaccineSystem.Data.DTO.Email;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        public AuthController(IAuthService authService, APIResponse response)
        {
            _authService = authService;
            _response = response;
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
                _response.Result = new { Message = "Registration successful. Please confirm your email." };
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
        [HttpPost("confirm-email")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest model)
        {
            try
            {
                var result = await _authService.ConfirmEmailAsync(model.Email, model.Token);

                if (!result)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Invalid or expired token.");
                    return BadRequest(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = new { Message = "Email confirmed successfully." };
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
                _response.StatusCode = HttpStatusCode.Unauthorized;
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
                _response.ErrorMessages.Add("Refresh token is required.");
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
                _response.ErrorMessages.Add("Email is required.");
                return BadRequest(_response);
            }

            try
            {
                await _authService.ForgetPasswordAsync(model.Email);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = new { Message = "Password reset link sent." };
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
                    _response.ErrorMessages.Add("Email, Token, and New Password are required.");
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
                _response.ErrorMessages.Add($"System Error: {ex.Message}");
                return BadRequest(_response);
            }
        }
    }
}
