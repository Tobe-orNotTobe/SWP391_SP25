using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Common.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO.VaccineInventory;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Staff,Manager")]
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
            _response.Result = await _vaccineInventoryService.GetVaccineInventoryAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        /// <summary>
        /// Lấy thông tin tồn kho vaccine theo ID
        /// </summary>
        [HttpGet("stockByVaccineId/{vaccineId}")]
        public async Task<IActionResult> GetVaccineInventory(int vaccineId)
        {
            try
            {
                var vaccineInventories = await _vaccineInventoryService.GetVaccineInventoryByIdAsync(vaccineId);
                _response.Result = vaccineInventories;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
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
                _response.ErrorMessages.Add($"Lỗi máy chủ nội bộ: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }

            return Ok(_response);
        }

        /// <summary>
        /// Lấy thông tin tồn kho vaccine theo VaccineInventoryId
        /// </summary>
        [HttpGet("stockByVaccineInventory/{vaccineInventoryId}")]
        public async Task<IActionResult> GetVaccineInventoryByVaccineInventoryId(int vaccineInventoryId)
        {
            try
            {
                var vaccineInventories = await _vaccineInventoryService.GetVaccineInventoryByVaccineInventoryIdAsync(vaccineInventoryId);
                _response.Result = vaccineInventories;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
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
                _response.ErrorMessages.Add($"Lỗi máy chủ nội bộ: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }

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
        [HttpPost("export/{id}")]
        public async Task<IActionResult> ExportVaccine(int id, [FromBody] int quantity)
        {
            try
            {
                await _vaccineInventoryService.ExportVaccineAsync(id, quantity);
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
                _response.Result = "Vắc-xin đã được trả về thành công";
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
        //[HttpGet("export")]
        //public async Task<IActionResult> GetIssuedVaccines()
        //{
        //    _response.Result = await _vaccineInventoryService.GetExportVaccinesAsync();
        //    _response.StatusCode = HttpStatusCode.OK;
        //    _response.IsSuccess = true;
        //    return Ok(_response);
        //}


        /// <summary>
        /// Lấy danh sách vaccine đã hoàn trả về kho
        /// </summary>
        //[HttpGet("returned")]
        //public async Task<IActionResult> GetReturnedVaccines()
        //{
        //    _response.Result = await _vaccineInventoryService.GetReturnedVaccinesAsync();
        //    _response.StatusCode = HttpStatusCode.OK;
        //    _response.IsSuccess = true;
        //    return Ok(_response);
        //}

        /// <summary>
        /// Kiểm tra vaccine sắp hết hạn
        /// </summary>
        //[HttpGet("expiry-check/{daysThreshold}")]
        //public async Task<IActionResult> CheckExpiry(int daysThreshold)
        //{
        //    _response.Result = await _vaccineInventoryService.GetExpiringVaccinesAsync(daysThreshold);
        //    _response.StatusCode = HttpStatusCode.OK;
        //    _response.IsSuccess = true;
        //    return Ok(_response);
        //}

        /// <summary>
        /// Kiểm tra vaccine có số lượng thấp
        /// </summary>
        //[HttpGet("low-stock/{threshold}")]
        //public async Task<IActionResult> CheckLowStock(int threshold)
        //{
        //    _response.Result = await _vaccineInventoryService.GetLowStockVaccinesAsync(threshold);
        //    _response.StatusCode = HttpStatusCode.OK;
        //    _response.IsSuccess = true;
        //    return Ok(_response);
        //}

        /// <summary>
        /// Gửi cảnh báo vaccine hết hạn hoặc sắp hết 
        /// </summary>
        //[HttpPost("alerts/expiry")]
        //public async Task<IActionResult> SendExpiryAlerts([FromBody] int daysThreshold)
        //{
        //    try
        //    {
        //        await _vaccineInventoryService.SendExpiryAlertsAsync(daysThreshold);
        //        _response.Result = "Expiry alerts sent successfully";
        //        _response.StatusCode = HttpStatusCode.OK;
        //        _response.IsSuccess = true;
        //        return Ok(_response);
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.StatusCode = HttpStatusCode.BadRequest;
        //        _response.IsSuccess = false;
        //        _response.ErrorMessages.Add(ex.Message);
        //        return BadRequest(_response);
        //    }
        //}

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

        /// <summary>
        /// Edit VaccineInventory 
        /// </summary>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateVaccineInventory(int id, [FromBody] UpdateVaccineInventoryDTO dto)
        {
            try
            {
                var result = await _vaccineInventoryService.UpdateVaccineInventoryAsync(id, dto);
                _response.Result = result;
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
        /// Soft Delete VaccineInventory
        /// </summary>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> SoftDeleteVaccineInventory(int id)
        {
            try
            {
                var result = await _vaccineInventoryService.SoftDeleteVaccineInventoryAsync(id);
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
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
