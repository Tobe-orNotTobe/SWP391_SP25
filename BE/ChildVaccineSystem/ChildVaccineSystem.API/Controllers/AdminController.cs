﻿using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.ServiceContract.Interfaces;

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

        public AdminController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IWalletService walletService, APIResponse response)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _walletService = walletService;
            _response = response;
        }

        [HttpPost("create-account")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<IActionResult> CreateAccount([FromBody] RegisterAccountDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.Password))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Dữ liệu người dùng không hợp lệ.");
                return BadRequest(_response);
            }

            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Vai trò '{model.Role}' không tồn tại.");
                return BadRequest(_response);
            }

            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber,
                DateOfBirth = model.DateOfBirth,
                EmailConfirmed = true,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(_response);
            }

			if(model.Role == "Customer")
				await _walletService.CreateWalletAsync(user.Id, isAdminWallet: false);

			await _userManager.AddToRoleAsync(user, model.Role);
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = $"Tài khoản đã được tạo thành công với vai trò '{model.Role}'";
            return Ok(_response);
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

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = user;
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

            user.FullName = model.FullName;
            user.Address = model.Address;
            user.DateOfBirth = model.DateOfBirth;

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
                    Role = "Doctor"
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
