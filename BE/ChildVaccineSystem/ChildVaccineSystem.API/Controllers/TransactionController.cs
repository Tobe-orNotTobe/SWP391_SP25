using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Transaction;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class TransactionController : ControllerBase
	{
		private readonly ITransactionService _transactionService;
		private readonly APIResponse _response;

		public TransactionController(ITransactionService transactionService, APIResponse response)
		{
			_transactionService = transactionService;
			_response = response;
		}

		/// <summary>
		/// Lấy ID giao dịch
		/// </summary>
		/// <param name="id">Transaction ID</param>
		/// <returns>Transaction details</returns>
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetById(int id)
		{
			try
			{
				var transaction = await _transactionService.GetTransactionByIdAsync(id);
				if (transaction == null)
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy giao dịch!");
					return NotFound(_response);
				}

				_response.Result = transaction;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi truy xuất giao dịch: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Lấy tất cả các giao dịch cho người dùng hiện tại
		/// </summary>
		/// <returns>List of transactions</returns>
		[HttpGet("my-transactions")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetMyTransactions()
		{
			try
			{
				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Không tìm thấy người dùng!");
					return Unauthorized(_response);
				}

				var transactions = await _transactionService.GetTransactionsByUserAsync(userId);

				_response.Result = transactions;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi truy xuất giao dịch: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Gets all transactions for a specific booking
		/// </summary>
		/// <param name="bookingId">Booking ID</param>
		/// <returns>List of transactions for the booking</returns>
		[HttpGet("booking/{bookingId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetByBookingId(int bookingId)
		{
			try
			{
				var transactions = await _transactionService.GetTransactionsByBookingAsync(bookingId);
				if (transactions == null || !transactions.Any())
				{
					_response.StatusCode = HttpStatusCode.NotFound;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("No transactions found for this booking");
					return NotFound(_response);
				}

				_response.Result = transactions;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving transactions: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Tạo giao dịch mới theo cách thủ công
		/// </summary>
		/// <param name="createTransactionDto">Transaction details</param>
		/// <returns>Created transaction</returns>
		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> Create(CreateTransactionDTO createTransactionDto)
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

				var transaction = await _transactionService.CreateTransactionAsync(createTransactionDto);

				_response.Result = transaction;
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;
				return CreatedAtAction(nameof(GetById), new { id = transaction.TransactionId }, _response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Lỗi khi truy xuất giao dịch: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Cập nhật trạng thái của giao dịch
		/// </summary>
		/// <param name="id">Transaction ID</param>
		/// <param name="status">New status</param>
		/// <param name="responseCode">Optional response code</param>
		/// <returns>Updated transaction</returns>
		[HttpPut("{id}/status")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> UpdateStatus(int id, [FromQuery] string status)
		{
			try
			{
				var transaction = await _transactionService.UpdateTransactionStatusAsync(id, status);

				_response.Result = transaction;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (ArgumentException ex)
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
				_response.ErrorMessages.Add($"Lỗi khi truy xuất giao dịch: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}