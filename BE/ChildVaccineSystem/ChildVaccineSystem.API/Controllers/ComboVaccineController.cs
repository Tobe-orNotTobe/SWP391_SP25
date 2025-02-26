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
            var response = new APIResponse();

            if (comboDto.VaccineIds.Distinct().Count() != comboDto.VaccineIds.Count)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add("Combo Vaccine cannot contain duplicate vaccines. Please remove duplicate entries and try again.");
                return BadRequest(response);
            }

            var result = await _comboService.CreateAsync(comboDto);

            if (result == null)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add("Failed to create Combo Vaccine. Please check your input data and try again.");
                return BadRequest(response);
            }

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = result;

            return CreatedAtAction(nameof(GetById), new { id = result.ComboId }, response);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateComboVaccineDTO comboDto)
        {
            var response = new APIResponse();

            if (!ModelState.IsValid)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                return BadRequest(response);
            }

            try
            {
                var updatedCombo = await _comboService.UpdateAsync(id, comboDto);
                if (updatedCombo == null)
                {
                    response.IsSuccess = false;
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.ErrorMessages.Add("Combo Vaccine not found or no new vaccines added.");
                    return NotFound(response);
                }

                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = updatedCombo;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add(ex.Message);
                return BadRequest(response);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new APIResponse();

            var isDeleted = await _comboService.DeleteAsync(id);

            if (!isDeleted)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.NotFound;
                response.ErrorMessages.Add("Combo Vaccine not found or already deleted.");
                return NotFound(response);
            }

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = "Combo Vaccine has been deactivated successfully.";

            return Ok(response);
        }
    }
}
