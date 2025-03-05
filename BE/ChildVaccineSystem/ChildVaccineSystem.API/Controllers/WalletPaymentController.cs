using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Payment;
using ChildVaccineSystem.Service.Services;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/payment/wallet")]
	[ApiController]
	[Authorize]
	public class WalletPaymentController : ControllerBase
	{
		private readonly IPaymentService _paymentService;
		private readonly IWalletService _walletService;
		private readonly APIResponse _response;

		public WalletPaymentController(
			IPaymentService paymentService,
			IWalletService walletService,
			APIResponse response)
		{
			_paymentService = paymentService;
			_walletService = walletService;
			_response = response;
		}

		[HttpPost("process")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> ProcessWalletPayment([FromBody] WalletPaymentDTO paymentDto)
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

				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var result = await _paymentService.ProcessWalletPaymentAsync(userId, paymentDto);

				if (result.Success)
				{
					_response.Result = result;
					_response.StatusCode = HttpStatusCode.OK;
					_response.IsSuccess = true;
					return Ok(_response);
				}
				else
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add(result.Message);
					return BadRequest(_response);
				}
			}
			catch (UnauthorizedAccessException ex)
			{
				_response.StatusCode = HttpStatusCode.Unauthorized;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return Unauthorized(_response);
			}
			catch (InvalidOperationException ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error processing payment: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}