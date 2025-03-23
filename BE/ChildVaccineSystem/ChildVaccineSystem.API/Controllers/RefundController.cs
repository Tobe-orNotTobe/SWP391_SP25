using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Refund;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RefundController : ControllerBase
	{
		private readonly IRefundService _refundService;
		private readonly APIResponse _response;

		public RefundController(IRefundService refundService, APIResponse response)
		{
			_refundService = refundService;
			_response = response;
		}

		/// <summary>
		/// lấy list yêu cầu refund 
		/// </summary>
		/// <returns></returns>
		[HttpGet("requests")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetAllRefundRequests()
		{
			try
			{
				var refundRequests = await _refundService.GetAllRefundRequestsAsync();

				_response.Result = refundRequests;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving refund requests: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Lấy yêu cầu refund của customer
		/// </summary>
		/// <returns></returns>
		[HttpGet("requests/my")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetMyRefundRequests()
		{
			try
			{
				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var refundRequests = await _refundService.GetUserRefundRequestsAsync(userId);

				_response.Result = refundRequests;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving refund requests: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpGet("requests/{id}")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetRefundRequestById(int id)
		{
			try
			{
				var refundRequest = await _refundService.GetRefundRequestByIdAsync(id);

				// Check if user is authorized to view this refund request
				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				var isAdmin = User.IsInRole("Admin");

				if (!isAdmin && refundRequest.UserId != userId)
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("You are not authorized to view this refund request");
					return Unauthorized(_response);
				}

				_response.Result = refundRequest;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return NotFound(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving refund request: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Tạo yêu cầu refund 
		/// </summary>
		/// <param name="createDto"></param>
		/// <returns></returns>
		[HttpPost("request")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> CreateRefundRequest([FromBody] CreateRefundRequestDTO createDto)
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

				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy người dùng trong token");
					return Unauthorized(_response);
				}

				var refundRequest = await _refundService.CreateRefundRequestAsync(userId, createDto);

				_response.Result = new
				{
					Message = $"Đã yêu cầu hoàn lại {refundRequest.Amount:C} dựa trên chính sách hủy.",
					RefundRequest = refundRequest
				};
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;

				return CreatedAtAction(nameof(GetRefundRequestById), new { id = refundRequest.RefundRequestId }, _response);
			}
			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return NotFound(_response);
			}
			catch (UnauthorizedAccessException ex)
			{
				_response.StatusCode = HttpStatusCode.Unauthorized;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return Unauthorized(_response);
			}
			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error creating refund request: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPut("approve/{id}")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> ApproveRefundRequest(int id)
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

				var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(adminId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var refundRequest = await _refundService.ApproveRefundRequestAsync(id, adminId);

				_response.Result = refundRequest;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return NotFound(_response);
			}
			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error approving refund request: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPut("reject/{id}")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> RejectRefundRequest(int id, [FromBody] ProcessRefundRequestDTO processDto)
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

				var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(adminId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var refundRequest = await _refundService.RejectRefundRequestAsync(id, adminId, processDto);

				_response.Result = refundRequest;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return NotFound(_response);
			}
			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error rejecting refund request: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}