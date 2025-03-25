using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class VnPaymentController : ControllerBase
	{
		private readonly IVnPaymentService _vnPaymentService;
		private readonly APIResponse _response;

		public VnPaymentController(
			IVnPaymentService vnPaymentService,
			APIResponse response)
		{
			_vnPaymentService = vnPaymentService;
			_response = response;
		}

		/// <summary>
		/// Tạo link thanh toán
		/// </summary>
		/// <param name="bookingId"></param>
		/// <returns></returns>
		[HttpPost("create-payment/{bookingId}")]
		public async Task<ActionResult<APIResponse>> CreatePaymentUrlVnpay(int bookingId)
		{
			try
			{
				string ipAddress = Utils.GetIpAddress(HttpContext);

				var paymentUrl = await _vnPaymentService.CreatePaymentUrl(bookingId, ipAddress);

				_response.Result = new { PaymentUrl = paymentUrl };
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;

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

				return BadRequest(_response);
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
				_response.ErrorMessages.Add($"Error creating payment: {ex.Message}");

				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// bắt link trả về từ VnPay
		/// </summary>
		/// <returns></returns>
		[HttpGet("payment-return")]
		public async Task<IActionResult> PaymentReturn()
		{
			var vnpayData = new Dictionary<string, string>();
			foreach (var key in Request.Query.Keys)
			{
				vnpayData[key] = Request.Query[key];
			}

			var frontendUrl = HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetValue<string>("AppSettings:FrontendUrl");
			var successUrl = $"{frontendUrl}/payment-success";
			var failureUrl = $"{frontendUrl}/payment-failure";

			try
			{
				bool paymentSuccess = await _vnPaymentService.PaymentExecute(vnpayData);

				if (paymentSuccess)
				{
					var amount = Convert.ToDecimal(vnpayData["vnp_Amount"]) / 100;
					successUrl += $"?orderId={vnpayData["vnp_TxnRef"]}&amount={amount}";
					return Redirect(successUrl);
				}
				else
				{
					failureUrl += $"?orderId={vnpayData["vnp_TxnRef"]}&errorCode={vnpayData["vnp_ResponseCode"]}";
					return Redirect(failureUrl);
				}
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine($"Error processing payment return: {ex}");

				failureUrl += $"?error={WebUtility.UrlEncode(ex.Message)}";
				return Redirect(failureUrl);
			}
		}
	}
}