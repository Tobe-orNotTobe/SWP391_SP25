using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
	public class AdminNotificationController : ControllerBase
	{
		private readonly INotificationService _notificationService;
		private readonly UserManager<User> _userManager;
		private readonly APIResponse _response;

		public AdminNotificationController(
			INotificationService notificationService,
			UserManager<User> userManager,
			APIResponse response)
		{
			_notificationService = notificationService;
			_userManager = userManager;
			_response = response;
		}

		/// <summary>
		/// Gửi thông báo cho 1 user cụ thể
		/// </summary>
		[HttpPost("send-to-user")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> SendNotificationToUser([FromBody] SendNotificationDTO notificationDto)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages = ModelState.Values
						.SelectMany(v => v.Errors)
						.Select(e => e.ErrorMessage)
						.ToList();
					return BadRequest(_response);
				}

				// Verify user exists
				var user = await _userManager.FindByIdAsync(notificationDto.UserId);
				if (user == null)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy người dùng với ID đã cung cấp.");
					return BadRequest(_response);
				}

				var result = await _notificationService.SendNotificationAsync(notificationDto);

				_response.Result = result;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi gửi thông báo: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Gửi thông báo cho tất cả khách hàng
		/// </summary>
		[HttpPost("send-to-all-customers")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> SendNotificationToAllCustomers([FromBody] BroadcastNotificationDTO notificationDto)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages = ModelState.Values
						.SelectMany(v => v.Errors)
						.Select(e => e.ErrorMessage)
						.ToList();
					return BadRequest(_response);
				}

				// Get all users with role "Customer"
				var customersInRole = await _userManager.GetUsersInRoleAsync("Customer");
				if (!customersInRole.Any())
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy người dùng nào với vai trò 'Customer'.");
					return BadRequest(_response);
				}

				// Count of successfully sent notifications
				int sentCount = 0;
				var failedUsers = new List<string>();

				// Send notification to each customer
				foreach (var customer in customersInRole)
				{
					try
					{
						var singleNotification = new SendNotificationDTO
						{
							UserId = customer.Id,
							Message = notificationDto.Message,
							Type = "Admin"
						};

						await _notificationService.SendNotificationAsync(singleNotification);
						sentCount++;
					}
					catch
					{
						failedUsers.Add(customer.UserName);
					}
				}

				_response.Result = new
				{
					TotalCustomers = customersInRole.Count,
					SuccessfullySent = sentCount,
					FailedCount = failedUsers.Count,
					FailedUsers = failedUsers
				};
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi gửi thông báo hàng loạt: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Lấy danh sách thông báo admin đã gửi
		/// </summary>
		[HttpGet("sent-notifications")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetSentNotifications()
		{
			try
			{
				var notifications = await _notificationService.GetAdminSentNotificationsAsync();

				_response.Result = notifications;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi lấy thông báo đã gửi: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetNotificationById(int id)
		{
			try
			{
				var notification = await _notificationService.GetNotificationByIdAsync(id);
				if (notification == null)
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy thông báo.");
					return NotFound(_response);
				}

				_response.Result = notification;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi lấy thông tin thông báo: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> UpdateNotification(int id, [FromBody] UpdateNotificationDTO updateDto)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages = ModelState.Values
						.SelectMany(v => v.Errors)
						.Select(e => e.ErrorMessage)
						.ToList();
					return BadRequest(_response);
				}

				var result = await _notificationService.UpdateNotificationAsync(id, updateDto);
				if (!result)
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy thông báo hoặc không thể cập nhật.");
					return NotFound(_response);
				}

				_response.Result = await _notificationService.GetNotificationByIdAsync(id);
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi cập nhật thông báo: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> DeleteNotification(int id)
		{
			try
			{
				var result = await _notificationService.DeleteNotificationByAdminAsync(id);
				if (!result)
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy thông báo hoặc không thể xóa.");
					return NotFound(_response);
				}

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = "Thông báo đã được xóa thành công.";
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi xóa thông báo: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}