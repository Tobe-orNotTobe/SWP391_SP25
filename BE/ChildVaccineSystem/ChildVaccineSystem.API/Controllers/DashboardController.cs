using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Service.Services;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IFeedbackService _feedbackService;
        private readonly IVaccineInventoryService _vaccineInventoryService;
        private readonly APIResponse _response;

        public DashboardController(ITransactionService transactionService,IFeedbackService feedbackService,IVaccineInventoryService vaccineInventoryService ,APIResponse response)
        {
            _transactionService = transactionService;
            _feedbackService = feedbackService;
            _vaccineInventoryService = vaccineInventoryService;
            _response = response;
        }

        [HttpGet("revenue/{date}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> GetRevenueByDate(DateTime date)
        {
            try
            {
                var revenue = await _transactionService.GetTotalRevenueByDateAsync(date);

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = revenue;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error retrieving revenue: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpGet("feedbacks")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> GetAllFeedback()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbackAsync();
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = feedbacks;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error retrieving feedback: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }
        [HttpGet("exported-vaccines")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> GetExportedVaccines()
        {
            try
            {
                // Lấy danh sách các vaccine đã xuất kho từ service
                var exportedVaccines = await _vaccineInventoryService.GetExportVaccinesAsync();

                // Trả về kết quả với dữ liệu vaccine đã xuất
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = exportedVaccines;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error retrieving exported vaccines: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

    }
}
