using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.VaccineRecord;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
   
    public class VaccineRecordController : ControllerBase
    {
        private readonly IVaccineRecordService _vaccineRecordService;
        private readonly APIResponse _response;

        public VaccineRecordController(IVaccineRecordService vaccineRecordService, APIResponse response)
        {
            _vaccineRecordService = vaccineRecordService;
            _response = response;
        }

        /// <summary>
        /// Bác sĩ tạo hồ sơ tiêm chủng cho lịch hẹn.
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor")]
        [HttpPost("{bookingDetailId}/create")]
        public async Task<ActionResult<APIResponse>> CreateVaccineRecord(int bookingDetailId)
        {
            try
            {
                var doctorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var record = await _vaccineRecordService.CreateVaccinationRecordAsync(bookingDetailId, doctorId);

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = record;
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

        /// <summary>
        /// Lấy chi tiết một hồ sơ tiêm chủng.
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Customer, Staff, Admin")]
        [HttpGet("{vaccineRecordId}")]
		public async Task<ActionResult<APIResponse>> GetVaccineRecordById(int vaccineRecordId)
		{
			try
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
                bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");

                var record = await _vaccineRecordService.GetVaccineRecordByIdAsync(vaccineRecordId, userId, isAdmin, isStaff);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = record;
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


		/// <summary>
		/// Lấy danh sách hồ sơ tiêm chủng theo BookingId.
		/// </summary>
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Customer, Staff, Admin")]
		[HttpGet("booking/{bookingId}")]
		public async Task<ActionResult<APIResponse>> GetVaccineRecordsByBookingId(int bookingId)
		{
			try
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
				bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");

				var record = await _vaccineRecordService.GetVaccineRecordsByBookingIdAsync(bookingId, userId, isAdmin, isStaff);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = record;
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


		/// <summary>
		/// Lấy danh sách tất cả hồ sơ tiêm chủng (Doctor/Staff).
		/// </summary>
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Customer, Staff, Admin")]
		[HttpGet("all")]
		public async Task<ActionResult<APIResponse>> GetAllVaccineRecords()
		{
			try
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
				bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");
				var records = await _vaccineRecordService.GetAllVaccineRecordsAsync(userId, isAdmin, isStaff);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.Result = records;
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



		/// <summary>
		/// Cập nhật hồ sơ tiêm chủng (trạng thái, ghi chú, ngày tiêm tiếp theo).
		/// </summary>
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Staff, Admin")]
		[HttpPut("{vaccineRecordId}/update")]
		public async Task<ActionResult<APIResponse>> UpdateVaccineRecord(int vaccineRecordId, [FromBody] UpdateVaccineRecordDTO updateDto)
		{
			try
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
				bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");

				var result = await _vaccineRecordService.UpdateVaccineRecordAsync(vaccineRecordId, updateDto, userId, isAdmin, isStaff);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = result;
				_response.Result = result ? "Cập nhật thành công." : "Cập nhật thất bại.";
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

		/// <summary>
		/// Xóa mềm một hồ sơ tiêm chủng (Soft Delete).
		/// </summary>
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Staff, Admin")]
		[HttpDelete("{vaccineRecordId}/delete")]
		public async Task<ActionResult<APIResponse>> SoftDeleteVaccineRecord(int vaccineRecordId)
		{
			try
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
				bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");

				var result = await _vaccineRecordService.SoftDeleteVaccineRecordAsync(vaccineRecordId, userId, isAdmin, isStaff);

				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = result;
				_response.Result = result ? "Hồ sơ đã được đánh dấu xóa." : "Xóa thất bại.";
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

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Doctor, Customer, Staff, Admin")]
        [HttpGet("bookingDetail/{bookingDetailId}")]
        public async Task<ActionResult<APIResponse>> GetVaccineRecordByBookingDetailId(int bookingDetailId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                bool isAdmin = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
                bool isStaff = User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Staff");

                var record = await _vaccineRecordService.GetVaccineRecordByBookingDetailIdAsync(bookingDetailId, userId, isAdmin, isStaff);

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = record;
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
