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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            if (string.IsNullOrEmpty(userId))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Mã thông báo thiếu ID người dùng.");
                return BadRequest(_response);
            }

            var userProfile = await _userService.GetProfileAsync(userId);
            if (userProfile == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy hồ sơ người dùng");
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
            _response.ErrorMessages.Add($"Lỗi khi truy xuất hồ sơ: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }

    [HttpPut("profile")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDTO model)
    {
        try
        {
            // Lấy userId từ token (claim NameIdentifier)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Token thiếu ID người dùng.");
                return BadRequest(_response);
            }

            // Đảm bảo rằng userId trong token trùng khớp với userId trong model (body request)
            // Không cần id trong model, chỉ cần lấy userId từ token
            model.Id = userId;

            // Cập nhật thông tin người dùng
            var success = await _userService.UpdateProfileAsync(model);

            if (!success)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể cập nhật hồ sơ");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = new { Message = "Hồ sơ đã được cập nhật thành công" };
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add($"Lỗi khi cập nhật hồ sơ: {ex.Message}");
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
                _response.ErrorMessages.Add("Token thiếu ID người dùng.");
                return BadRequest(_response);
            }

            // Gọi dịch vụ để thay đổi mật khẩu
            var success = await _userService.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword);
            if (!success)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu cũ.");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = new { Message = "Mật khẩu đã được thay đổi thành công" };
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add($"Lỗi khi thay đổi mật khẩu: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }

    [HttpGet("search")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> SearchUser(string keyword)
    {
        if (string.IsNullOrEmpty(keyword))
            return BadRequest("Keyword không được để trống");

        var user = await _userService.GetUserByPhoneOrEmailAsync(keyword);

        if (user == null)
            return NotFound("Không tìm thấy khách hàng");

        return Ok(user);
    }

}
