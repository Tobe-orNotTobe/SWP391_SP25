﻿using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ChildVaccineSystem.Common.Helper;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class BookingController : ControllerBase
	{
		private readonly IBookingService _bookingService;
		private readonly APIResponse _response;

		public BookingController(IBookingService bookingService, APIResponse response)
		{
			_bookingService = bookingService;
			_response = response;
		}

		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> Create(string userId, [FromBody] CreateBookingDTO bookingDto)
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

				var createdBooking = await _bookingService.CreateAsync(userId, bookingDto);
				_response.Result = createdBooking;
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;
				return CreatedAtAction(nameof(GetById), new { id = createdBooking.BookingId }, _response);
			}
			catch (ArgumentException ex)
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
				_response.ErrorMessages.Add($"Lỗi tạo đặt chỗ: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpGet("user/{userId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<APIResponse>> GetUserBookings(string userId)
		{
			try
			{
				var bookings = await _bookingService.GetUserBookingsAsync(userId);
				if (!bookings.Any())
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy đặt chỗ nào cho người dùng này");
					return NotFound(_response);
				}

				_response.Result = bookings;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi truy xuất đặt chỗ của người dùng: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<APIResponse>> GetById(int id)
		{
			try
			{
				var booking = await _bookingService.GetByIdAsync(id);
				if (booking == null)
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy đặt chỗ");
					return NotFound(_response);
				}

				_response.Result = booking;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi truy xuất đặt chỗ: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpDelete("{bookingId}/cancel")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<IActionResult> CancelBooking(int bookingId, [FromQuery] string userId)
		{
			try
			{
				var cancelledBooking = await _bookingService.CancelBookingAsync(bookingId, userId);

				_response.IsSuccess = true;
				_response.StatusCode = HttpStatusCode.OK;
				_response.Result = cancelledBooking;
				_response.ErrorMessages = new List<string>();

				return Ok(_response);
			}
			catch (ArgumentException ex)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.ErrorMessages = new List<string> { ex.Message };

				return BadRequest(_response);
			}
			catch (Exception ex)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.ErrorMessages = new List<string> { $"Lỗi hủy đặt chỗ: {ex.Message}" };

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
		[HttpPost("assign-doctor")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Staff")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<IActionResult> AssignDoctorToBooking(int bookingId, string userId)
		{
			try
			{
				var result = await _bookingService.AssignDoctorToBooking(bookingId, userId);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = new { Success = result, Message = "Bác sĩ chỉ định đặt phòng thành công." };
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

		[HttpGet("doctor/{userId}/bookings")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor,Admin,Staff")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<IActionResult> GetDoctorBookings(string userId)
		{
			try
			{
				var bookings = await _bookingService.GetDoctorBookingsAsync(userId);

				if (bookings.Any())
				{
					_response.StatusCode = HttpStatusCode.OK;
					_response.IsSuccess = true;
					_response.Result = bookings;
					return Ok(_response);
				}
				else
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy đặt chỗ nào cho bác sĩ này.");
					return NotFound(_response);
				}
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi truy xuất thông tin đặt chỗ của bác sĩ: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
		//[HttpPut("{bookingId}/complete")]
		//[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor,Admin,Staff")]
		//[ProducesResponseType(StatusCodes.Status200OK)]
		//[ProducesResponseType(StatusCodes.Status404NotFound)]
		//[ProducesResponseType(StatusCodes.Status400BadRequest)]
		//public async Task<ActionResult<APIResponse>> CompleteBooking(int bookingId)
		//{
		//    try
		//    {
		//        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

		//        var result = await _bookingService.CompleteBookingAsync(bookingId, userId);

		//        _response.StatusCode = HttpStatusCode.OK;
		//        _response.IsSuccess = true;
		//        _response.Result = result;

		//        return Ok(_response);
		//    }
		//    catch (ArgumentException ex)
		//    {
		//        _response.StatusCode = HttpStatusCode.BadRequest;
		//        _response.IsSuccess = false;
		//        _response.ErrorMessages.Add($"Error completing booking: {ex.Message}");
		//        return BadRequest(_response);
		//    }
		//    catch (Exception ex)
		//    {
		//        _response.StatusCode = HttpStatusCode.InternalServerError;
		//        _response.IsSuccess = false;
		//        _response.ErrorMessages.Add($"Error completing booking: {ex.Message}");
		//        return StatusCode((int)HttpStatusCode.InternalServerError, _response);
		//    }
		//}
		// Lấy tất cả các booking chưa được gán bác sĩ
		[HttpGet("unassigned")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Staff")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetUnassignedBookings()
		{
			try
			{
				var unassignedBookings = await _bookingService.GetUnassignedBookingsAsync();
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = unassignedBookings;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi truy xuất các đặt chỗ chưa được chỉ định: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
		[HttpGet("all-bookings")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetAllBookings()
		{
			try
			{
				var bookings = await _bookingService.GetAllBookingsAsync();
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = bookings;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi truy xuất tất cả đặt chỗ: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPost("{bookingId}/unassign-doctor")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<IActionResult> UnassignDoctor(int bookingId)
		{
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if (string.IsNullOrEmpty(userId))
				return Unauthorized();

			var result = await _bookingService.UnassignDoctorFromBookingAsync(bookingId, userId);

			if (result)
				return Ok(new { Message = "Hủy phân công thành công." });

			return BadRequest("Hủy phân công thất bại.");
		}

		/// <summary>
		/// Kiểm tra yêu cầu vaccine cha cho Vaccines
		/// </summary>
		/// <param name="VaccineIds">Danh sách vaccine ID cần kiểm tra</param>
		/// <returns>Danh sách thông báo cảnh báo</returns>
		[HttpPost("check-parent-vaccine")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> CheckParenVaccine([FromForm] List<int> VaccineIds)
		{
			try
			{
				var result = await _bookingService.CheckParentVaccinesInBookingAsync(VaccineIds);

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
	}
}