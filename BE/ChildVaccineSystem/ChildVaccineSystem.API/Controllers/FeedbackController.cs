using Microsoft.AspNetCore.Mvc;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Data.DTO.Feedback;
using ChildVaccineSystem.Common.Helper;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly APIResponse _response;

        public FeedbackController(IFeedbackService feedbackService, APIResponse response)
        {
            _feedbackService = feedbackService;
            _response = response;
        }

        // Get feedback by BookingId
        [HttpGet("{bookingId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetFeedbackByBookingId(int bookingId)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackByBookingIdAsync(bookingId);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = feedback;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi lấy phản hồi: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }


        // Add feedback
        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<APIResponse>> AddFeedback([FromBody] CreateFeedbackDTO createFeedbackDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                var createdFeedback = await _feedbackService.AddFeedbackAsync(createFeedbackDto, userId, userName);

                _response.StatusCode = HttpStatusCode.Created;
                _response.IsSuccess = true;
                _response.Result = createdFeedback;

                return Ok(_response);
            }
            catch (ArgumentException ex)
            {
                // Trả về lỗi 400 khi dữ liệu không hợp lệ (như feedback đã tồn tại)
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Dữ liệu không hợp lệ: {ex.Message}");
                return BadRequest(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi khi thêm phản hồi: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Update feedback
        [HttpPut("{bookingId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateFeedback(int bookingId, [FromBody] UpdateFeedbackDTO updateFeedbackDto)
        {
            try
            {
                var updatedFeedback = await _feedbackService.UpdateFeedbackAsync(bookingId, updateFeedbackDto);
                if (updatedFeedback == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy phản hồi cho đặt phòng được chỉ định.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = updatedFeedback;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi cập nhật phản hồi: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Delete feedback
        [HttpDelete("{bookingId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteFeedback(int bookingId)
        {
            try
            {
                var deletedFeedback = await _feedbackService.DeleteFeedbackAsync(bookingId);
                if (deletedFeedback == false)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy phản hồi cho đặt phòng được chỉ định.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = null; // No need to return any content on delete
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Lỗi xóa phản hồi: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }
    }
}
