using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Common.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Staff")]
    public class VaccineInventoryController : ControllerBase
    {
        private readonly IVaccineInventoryService _vaccineInventoryService;
        private readonly APIResponse _response;

        public VaccineInventoryController(IVaccineInventoryService vaccineInventoryService)
        {
            _vaccineInventoryService = vaccineInventoryService;
            _response = new APIResponse();
        }

        /// <summary>
        /// Lấy danh sách tồn kho vaccine
        /// </summary>
        [HttpGet("stock")]
        public async Task<IActionResult> GetVaccineStock()
        {
            _response.Result = await _vaccineInventoryService.GetVaccineStockReportAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Tìm kiếm vaccine trong kho theo từ khóa
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchVaccineStock([FromQuery] string keyword)
        {
            _response.Result = await _vaccineInventoryService.SearchVaccineStockAsync(keyword);
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Xuất vaccine khỏi kho
        /// </summary>
        [HttpPost("issue/{id}")]
        public async Task<IActionResult> IssueVaccine(int id, [FromBody] int quantity)
        {
            try
            {
                await _vaccineInventoryService.IssueVaccineAsync(id, quantity);
                _response.Result = "Vaccine issued successfully";
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
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
        /// Hoàn trả vaccine về kho
        /// </summary>
        [HttpPost("return/{id}")]
        public async Task<IActionResult> ReturnVaccine(int id, [FromBody] int quantity)
        {
            try
            {
                await _vaccineInventoryService.ReturnVaccineAsync(id, quantity);
                _response.Result = "Vaccine returned successfully";
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
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
        /// Lấy danh sách vaccine đã xuất kho
        /// </summary>
        [HttpGet("issued")]
        public async Task<IActionResult> GetIssuedVaccines()
        {
            _response.Result = await _vaccineInventoryService.GetIssuedVaccinesAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }


        /// <summary>
        /// Lấy danh sách vaccine đã hoàn trả về kho
        /// </summary>
        [HttpGet("returned")]
        public async Task<IActionResult> GetReturnedVaccines()
        {
            _response.Result = await _vaccineInventoryService.GetReturnedVaccinesAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Kiểm tra vaccine sắp hết hạn
        /// </summary>
        [HttpGet("expiry-check/{daysThreshold}")]
        public async Task<IActionResult> CheckExpiry(int daysThreshold)
        {
            _response.Result = await _vaccineInventoryService.GetExpiringVaccinesAsync(daysThreshold);
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Kiểm tra vaccine có số lượng thấp
        /// </summary>
        [HttpGet("low-stock/{threshold}")]
        public async Task<IActionResult> CheckLowStock(int threshold)
        {
            _response.Result = await _vaccineInventoryService.GetLowStockVaccinesAsync(threshold);
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Gửi cảnh báo vaccine hết hạn hoặc sắp hết 
        /// </summary>
        [HttpPost("alerts/expiry")]
        public async Task<IActionResult> SendExpiryAlerts([FromBody] int daysThreshold)
        {
            try
            {
                await _vaccineInventoryService.SendExpiryAlertsAsync(daysThreshold);
                _response.Result = "Expiry alerts sent successfully";
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
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
        /// Thêm VaccineInventory 
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddVaccineInventory([FromBody] CreateVaccineInventoryDTO dto)
        {
            try
            {
                var result = await _vaccineInventoryService.AddVaccineInventoryAsync(dto);
                _response.Result = result;
                _response.StatusCode = HttpStatusCode.Created;
                _response.IsSuccess = true;
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
