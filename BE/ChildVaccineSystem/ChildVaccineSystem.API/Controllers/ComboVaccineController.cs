using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ChildVaccineSystem.API.Controllers
{
	[ApiController]
    [Route("api/[controller]")]
    public class ComboVaccineController : ControllerBase
    {
        private readonly IComboVaccineService _comboService;
		private readonly APIResponse _response;

		public ComboVaccineController(IComboVaccineService comboService, APIResponse response)
        {
            _comboService = comboService;
            _response = response;
        }

        [HttpGet]
		public async Task<IActionResult> GetAll()
        {
			var result = await _comboService.GetAllAsync();

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
            var result = await _comboService.GetByIdAsync(id);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Combo Vaccine not found");
				return NotFound(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;
			return Ok(_response);
		}

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateComboVaccineDTO comboDto)
        {
            var result = await _comboService.CreateAsync(comboDto);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.ErrorMessages.Add("Create failure");
				return NotFound(_response);
			}	

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;

			return Ok(_response);

		}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateComboVaccineDTO comboDto)
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

			var updatedCombo = await _comboService.UpdateAsync(id, comboDto);
			if (updatedCombo == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Combo Vaccine not found");
				return NotFound(_response);
			}

			_response.Result = updatedCombo;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _comboService.DeleteAsync(id);

			if (isDeleted == false)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Combo Vaccine not found");
				return NotFound(_response);
			}

			_response.Result = isDeleted;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
		}
    }
}
