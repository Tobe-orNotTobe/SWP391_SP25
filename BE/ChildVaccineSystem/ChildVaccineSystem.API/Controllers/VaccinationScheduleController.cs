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

		/// <summary>
		/// Xem lịch tiêm chủng
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<APIResponse>> GetAll()
		{
			try
			{
				var result = await _scheduleService.GetAllSchedulesAsync();

				if (!result.Any())
				{
					_response.IsSuccess = false;
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.ErrorMessages.Add("Không tìm thấy lịch");

					return BadRequest(_response);
				}


				_response.IsSuccess = true;
				_response.StatusCode = HttpStatusCode.OK;
				_response.Result = result;

				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.ErrorMessages.Add($"Lỗi khi lấy lịch: {ex.Message}");

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Xem lịch tiêm chủng của ID
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<APIResponse>> GetById(int id)
		{
			var result = await _scheduleService.GetScheduleByIdAsync(id);

			if (result == null)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Không tìm thấy lịch");

				return NotFound(_response);
			}

			_response.IsSuccess = true;
			_response.StatusCode = HttpStatusCode.OK;
			_response.Result = result;

			return Ok(_response);
		}

		/// <summary>
		/// Tạo lịch tiêm chủng cho độ tuổi trẻ em
		/// </summary>
		/// <param name="scheduleDto"></param>
		/// <returns></returns>
		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status409Conflict)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> Create([FromBody] CreateVaccinationScheduleDTO scheduleDto)
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

				var result = await _scheduleService.CreateScheduleAsync(scheduleDto);

				_response.Result = result;
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;

				return CreatedAtAction(nameof(GetById), new { id = result.ScheduleId }, _response);
			}

			catch (ArgumentException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return BadRequest(_response);
			}

			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return NotFound(_response);
			}

			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.Conflict;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return Conflict(_response);
			}

			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error creating schedule: {ex.Message}");

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Cập nhật lịch tiêm chủng
		/// </summary>
		/// <param name="id"></param>
		/// <param name="scheduleDto"></param>
		/// <returns></returns>
		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status409Conflict)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> Update(int id, [FromBody] UpdateVaccinationScheduleDTO scheduleDto)
		{
			try
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
					_response.ErrorMessages.Add("Không tìm lấy lịch");
					return NotFound(_response);
				}

				_response.Result = updatedSchedule;
				_response.StatusCode = HttpStatusCode.OK;

				return Ok(_response);
			}

			catch (ArgumentException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return BadRequest(_response);
			}

			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return NotFound(_response);
			}

			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.Conflict;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return Conflict(_response);
			}

			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi cập nhật lịch: {ex.Message}");

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Xóa lịch
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpDelete("{id}")]
		public async Task<ActionResult<APIResponse>> Delete(int id)
		{
			var isDeleted = await _scheduleService.DeleteScheduleAsync(id);

			if (isDeleted == false)
			{
				_response.IsSuccess = false;
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.ErrorMessages.Add("Không tìm thấy lịch");

				return NotFound(_response);
			}

			_response.Result = isDeleted;
			_response.StatusCode = HttpStatusCode.OK;

			return Ok(_response);
		}


		/// <summary>
		/// Lấy lịch tiêm chủng và danh sách vaccine/combo vaccine phù hợp với độ tuổi của trẻ
		/// </summary>
		/// <param name="childrenId">ID của trẻ</param>
		/// <returns>Lịch tiêm và danh sách vaccine/combo vaccine phù hợp</returns>
		[HttpGet("by-children/{childrenId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetScheduleByChildrenAge(int childrenId)
		{
			try
			{
				var result = await _scheduleService.GetScheduleByChildrenAgeAsync(childrenId);

				_response.Result = result;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;

				return Ok(_response);
			}

			catch (KeyNotFoundException ex)
			{
				_response.StatusCode = HttpStatusCode.NotFound;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);

				return NotFound(_response);
			}

			catch (InvalidOperationException ex)
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
				_response.ErrorMessages.Add($"Lỗi khi truy vấn lịch tiêm chủng: {ex.Message}");

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}