using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Common.Helper;
using System.Net;
using ChildVaccineSystem.Data.DTO.Vaccine;

namespace ChildVaccineSystem.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class VaccineController : ControllerBase
	{
		private readonly IVaccineService _vaccineService;
		private readonly APIResponse _response;

		public VaccineController(IVaccineService vaccineService, APIResponse response)
		{
			_vaccineService = vaccineService;
			_response = response;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var result = await _vaccineService.GetAllVaccinesAsync();

			if (!result.Any())
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;
			return Ok(_response);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var result = await _vaccineService.GetVaccineByIdAsync(id);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Không tìm thấy vắc xin");
				return NotFound(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;
			return Ok(_response);
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateVaccineDTO vaccineDto)
		{
			var result = await _vaccineService.CreateVaccineAsync(vaccineDto);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.ErrorMessages.Add("Tạo thất bại");
				return NotFound(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;

			return Ok(_response);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] UpdateVaccineDTO vaccineDto)
		{
			if (!ModelState.IsValid)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.ErrorMessages = ModelState.Values
						.SelectMany(v => v.Errors)
						.Select(e => e.ErrorMessage)
						.ToList();
				return BadRequest(_response);
			}

			var updatedVaccine = await _vaccineService.UpdateVaccineAsync(id, vaccineDto);

			if (updatedVaccine == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Không tìm thấy vắc xin");
				return NotFound(_response);
			}

			_response.Result = updatedVaccine;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var isDeleted = await _vaccineService.DeleteVaccineAsync(id);

			if (isDeleted == false)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Không tìm thấy vắc xin");
				return NotFound(_response);
			}

			_response.Result = isDeleted;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
		}

		[HttpGet("type/{isNecessary}")]
		public async Task<IActionResult> GetByType(bool isNecessary)
		{
			var result = await _vaccineService.GetVaccinesByTypeAsync(isNecessary);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;
			return Ok(_response);
		}

        [HttpGet("basic")]
        public async Task<IActionResult> GetBasicVaccines()
        {
            var vaccines = await _vaccineService.GetBasicVaccinesAsync();
            return Ok(vaccines);
        }

    }
}
