using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ChildVaccineSystem.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class VaccinationScheduleController : ControllerBase
	{
		private readonly IVaccinationScheduleService _scheduleService;
		private readonly APIResponse _response;

		public VaccinationScheduleController(IVaccinationScheduleService scheduleService, APIResponse response)
		{
			_scheduleService = scheduleService;
			_response = response;
		}

		[HttpGet]
		public async Task<ActionResult<APIResponse>> GetAll()
		{
			var result = await _scheduleService.GetAllSchedulesAsync();

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
		public async Task<ActionResult<APIResponse>> GetById(int id)
		{
			var result = await _scheduleService.GetScheduleByIdAsync(id);
			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Schedule not found");
				return NotFound(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;
			return Ok(_response);
		}

		[HttpPost]
		public async Task<ActionResult<APIResponse>> Create([FromBody] CreateVaccinationScheduleDTO scheduleDto)
		{
			var result = await _scheduleService.CreateScheduleAsync(scheduleDto);

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
		public async Task<ActionResult<APIResponse>> Update(int id, [FromBody] UpdateVaccinationScheduleDTO scheduleDto)
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

			var updatedSchedule = await _scheduleService.UpdateScheduleAsync(id, scheduleDto);
			if (updatedSchedule == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Schedule not found");
				return NotFound(_response);
			}

			_response.Result = updatedSchedule;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult<APIResponse>> Delete(int id)
		{
			var isDeleted = await _scheduleService.DeleteScheduleAsync(id);
			if (isDeleted == false)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Schedule not found");
				return NotFound(_response);
			}

			_response.Result = isDeleted;
			_response.StatusCode = HttpStatusCode.OK;
			return Ok(_response);
		}
	}
}