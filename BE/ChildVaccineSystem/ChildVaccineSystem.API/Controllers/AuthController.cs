using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Category;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO dto)
        {
            try
            {
                var user = await _authService.RegisterAsync(dto);
                return Ok(new { Message = "Registration successful. Please confirm your email." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest model)
        {
            try
            {
                var result = await _authService.ConfirmEmailAsync(model.Email, model.Token);

                if (!result)
                    return BadRequest(new { Error = "Invalid or expired token." });

                return Ok(new { Message = "Email confirmed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            try
            {
                var result = await _authService.LoginAsync(loginRequestDTO);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.RefreshToken))
            {
                return BadRequest(new { Error = "Refresh token is required." });
            }

            try
            {
                var result = await _authService.RefreshTokenAsync(model.RefreshToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordRequestDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return BadRequest(new { Error = "Email is required." });
            }

            try
            {
                await _authService.ForgetPasswordAsync(model.Email);
                return Ok(new { Message = "Password reset link sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
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
                    return BadRequest(new { Error = "Email, Token, and New Password are required." });
                }

                var (success, message) = await _authService.ResetPasswordAsync(dto.Email, dto.Token, dto.NewPassword);

                if (!success)
                {
                    return BadRequest(new { Success = false, Error = message });
                }

                return Ok(new { Success = true, Message = message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Error = $"System Error: {ex.Message}" });
            }
        }

    }
}
