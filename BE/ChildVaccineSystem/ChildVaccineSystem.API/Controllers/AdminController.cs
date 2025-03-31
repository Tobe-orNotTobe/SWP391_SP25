using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Service.Services;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
		private readonly IWalletService _walletService;
		private readonly APIResponse _response;
        private readonly IUserService _userService;

        public AdminController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IWalletService walletService, APIResponse response, IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _walletService = walletService;
            _response = response;
            _userService = userService;
        }

        [HttpPost("create-account")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> CreateAccount([FromBody] RegisterAccountDTO model)
        {
            var (success, message, errors) = await _userService.CreateUserAsync(model);

            var response = new APIResponse();

            if (!success)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.IsSuccess = false;
                response.ErrorMessages = errors ?? new List<string> { message ?? "Lỗi không xác định." };
                return BadRequest(response);
            }

            response.StatusCode = HttpStatusCode.OK;
            response.IsSuccess = true;
            response.Result = message;
            return Ok(response);
        }

        [HttpGet("getAllUsers")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();

            var userWithRoles = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userWithRoles.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.FullName,
                    user.Email,
                    user.Address,
                    user.DateOfBirth,
                    user.IsActive,
                    user.PhoneNumber,
                    Roles = roles
                });
            }

            var response = new
            {
                StatusCode = HttpStatusCode.OK,
                IsSuccess = true,
                ErrorMessages = new List<string>(),
                Result = userWithRoles
            };

            return Ok(response);
        }

		[HttpGet("admin/GetUserById/{id}")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		public async Task<IActionResult> GetUserById(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add("Không tìm thấy người dùng");
				return NotFound(_response);
			}

			var roles = await _userManager.GetRolesAsync(user);

			var userData = new
			{
				user.Id,
				user.UserName,
				user.FullName,
				user.Email,
				user.Address,
				user.DateOfBirth,
				user.IsActive,
				user.PhoneNumber,
				Roles = roles
			};

			_response.StatusCode = HttpStatusCode.OK;
			_response.IsSuccess = true;
			_response.Result = userData;
			return Ok(_response);
		}

		[HttpDelete("DeleteUser/{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy người dùng");
                return NotFound(_response);
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể xóa người dùng");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = "Người dùng đã được xóa thành công";
            return Ok(_response);
        }


		[HttpPut("UpdateUser")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		public async Task<IActionResult> UpdateUser([FromBody] UserDTO model)
		{
			var user = await _userManager.FindByIdAsync(model.Id);
			if (user == null)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add("Không tìm thấy người dùng");
				return NotFound(_response);
			}

			user.UserName = model.UserName;
			user.FullName = model.FullName;
			user.Address = model.Address;
			user.DateOfBirth = model.DateOfBirth;

			// Cập nhật vai trò nếu được truyền vào
			if (!string.IsNullOrWhiteSpace(model.Role))
			{
				var existingRoles = await _userManager.GetRolesAsync(user);

				// Xóa các role hiện tại
				var removeResult = await _userManager.RemoveFromRolesAsync(user, existingRoles);
				if (!removeResult.Succeeded)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không thể xóa vai trò hiện tại của người dùng");
					return BadRequest(_response);
				}

				// Kiểm tra role mới có tồn tại không
				if (!await _roleManager.RoleExistsAsync(model.Role))
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add($"Vai trò '{model.Role}' không tồn tại");
					return BadRequest(_response);
				}

				var addResult = await _userManager.AddToRoleAsync(user, model.Role);
				if (!addResult.Succeeded)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không thể thêm vai trò mới cho người dùng");
					return BadRequest(_response);
				}
			}

			var result = await _userManager.UpdateAsync(user);
			if (!result.Succeeded)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add("Không thể cập nhật người dùng");
				return BadRequest(_response);
			}

			_response.StatusCode = HttpStatusCode.OK;
			_response.IsSuccess = true;
			_response.Result = "Người dùng đã cập nhật thành công";
			return Ok(_response);
		}


		[HttpPut("activate/{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> ActivateUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy người dùng");
                return NotFound(_response);
            }

            user.IsActive = true;
            await _userManager.UpdateAsync(user);

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = "Người dùng đã được kích hoạt thành công";
            return Ok(_response);
        }

        [HttpPut("deactivate/{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> DeactivateUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy người dùng");
                return NotFound(_response);
            }

            user.IsActive = false;
            await _userManager.UpdateAsync(user);

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = "Người dùng đã bị vô hiệu hóa thành công";
            return Ok(_response);
        }
        [HttpGet("getAllDoctors")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                var role = await _roleManager.FindByNameAsync("Doctor");
                if (role == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tồn tại vai trò 'Bác sĩ'.");
                    return NotFound(_response);
                }

                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);

                var doctorDTOs = usersInRole.Select(user => new UserDTO
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    DateOfBirth = user.DateOfBirth,
                    IsActive = user.IsActive,
                    Role = "Doctor",
                    ImageUrl = user.ImageUrl
                }).ToList();

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = doctorDTOs;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi khi tìm kiếm bác sĩ: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpGet("getAllRoles")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = _roleManager.Roles.Select(role => new
                {
                    role.Name,
                    role.Id
                }).ToList();

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = roles;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi khi truy xuất vai trò: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

    }
}
