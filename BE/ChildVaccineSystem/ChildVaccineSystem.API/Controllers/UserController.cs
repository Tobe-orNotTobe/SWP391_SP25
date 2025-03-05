using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly APIResponse _response;

    public UserController(IUserService userService, APIResponse response)
    {
        _userService = userService;
        _response = response;
    }

    [HttpGet("profile")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Lấy userId từ token
            if (string.IsNullOrEmpty(userId))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("User ID is missing in the token.");
                return BadRequest(_response);
            }

            var userProfile = await _userService.GetProfileAsync(userId);
            if (userProfile == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("User profile not found");
                return NotFound(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = userProfile;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add($"Error retrieving profile: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }


    [HttpPut("profile")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDTO model)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            model.Id = userId; // Ensure we are updating the correct user profile
            var success = await _userService.UpdateProfileAsync(model);
            if (!success)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Failed to update profile");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = new { Message = "Profile updated successfully" };
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add($"Error updating profile: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }

    [HttpPost("change-password")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Lấy userId từ token
            if (string.IsNullOrEmpty(userId))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("User ID is missing in the token.");
                return BadRequest(_response);
            }

            // Gọi dịch vụ để thay đổi mật khẩu
            var success = await _userService.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword);
            if (!success)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Failed to change password. Please check the old password.");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = new { Message = "Password changed successfully" };
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add($"Error changing password: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }

}
