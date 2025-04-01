using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class WalletController : ControllerBase
	{
		private readonly IWalletService _walletService;
		private readonly IPaymentService _paymentService;
		private readonly IConfiguration _configuration;

		private readonly APIResponse _response;

		public WalletController(IWalletService walletService, IPaymentService paymentService, IConfiguration configuration, APIResponse response)
		{
			_walletService = walletService;
			_paymentService = paymentService;
			_configuration = configuration;
			_response = response;
		}

		/// <summary>
		/// Lấy ví cho người dùng
		/// </summary>
		/// <returns></returns>
		[HttpGet("user")]
		[Authorize(AuthenticationSchemes = "Bearer")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetUserWallet()
		{
			try
			{
				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var wallet = await _walletService.GetUserWalletAsync(userId);

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving wallet: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Admin nạp tiền vào hệ thống
		/// </summary>
		/// <param name="addFundsDto"></param>
		/// <returns></returns>
		[HttpPost("admin/add-funds")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> AddFundsToAdminWallet([FromBody] AddFundsDTO addFundsDto)
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

				var updatedWallet = await _walletService.AddFundsToAdminWalletAsync(addFundsDto);

				_response.Result = updatedWallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.ErrorMessages.Add($"Successfully added {addFundsDto.Amount:C} to admin wallet.");
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error adding funds: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Tạo yêu cầu nạp tiền và thanh toán bằng url VnPay
		/// </summary>
		/// <param name="depositDto"></param>
		/// <returns></returns>
		[HttpPost("deposit/create")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> CreateDeposit([FromBody] WalletDepositDTO depositDto)
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

				string ipAddress = Utils.GetIpAddress(HttpContext);

				var paymentUrl = await _walletService.CreateDepositAsync(userId, depositDto, ipAddress);

				_response.Result = new { PaymentUrl = paymentUrl };
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);

			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error creating deposit: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Xử lý việc trả lại tiền từ thanh toán VnPay cho các khoản tiền gửi vào ví
		/// </summary>
		/// <param name="vnpayParams"></param>
		/// <returns></returns>
		[HttpGet("deposit/payment-return")]
		[AllowAnonymous]
		public async Task<IActionResult> DepositReturn([FromQuery] Dictionary<string, string> vnpayParams)
		{
			var frontendUrl = _configuration.GetValue<string>("AppSettings:FrontendUrl");
			var successUrl = $"{frontendUrl}/wallet/deposit-success";
			var failureUrl = $"{frontendUrl}/wallet/deposit-failure";

			try
			{
				var match = Regex.Match(vnpayParams["vnp_TxnRef"], @"TXN(\d+)_TIME");
				int walletTransactionId = int.Parse(match.Groups[1].Value);

				if (!vnpayParams.TryGetValue("vnp_ResponseCode", out string responseCode))
				{
					return Redirect($"{failureUrl}?errorCode=missing_response_code");
				}

				var vnpSecureHash = vnpayParams["vnp_SecureHash"];
				var vnpHashSecret = _configuration["VnPay:HashSecret"];

				if (string.IsNullOrEmpty(vnpHashSecret))
				{
					return Redirect($"{failureUrl}?errorCode=system_configuration_error");
				}

				var signParams = vnpayParams
					.Where(p => p.Key != "vnp_SecureHash" && p.Key != "vnp_SecureHashType")
					.OrderBy(p => p.Key, StringComparer.InvariantCulture)
					.ToDictionary(p => p.Key, p => p.Value);

				var signData = string.Join("&", signParams.Select(p => $"{p.Key}={WebUtility.UrlEncode(p.Value)}"));
				var hmacSha512 = new System.Security.Cryptography.HMACSHA512(Encoding.UTF8.GetBytes(vnpHashSecret));
				var hash = hmacSha512.ComputeHash(Encoding.UTF8.GetBytes(signData));
				var calculatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

				if (calculatedSignature != vnpSecureHash.ToLower())
				{
					return Redirect($"{failureUrl}?errorCode=invalid_signature");
				}

				bool processResult = await _walletService.ProcessDepositAsync(walletTransactionId, responseCode);

				if (processResult && responseCode == "00")
				{
					if (vnpayParams.TryGetValue("vnp_Amount", out string amountString) &&
						long.TryParse(amountString, out long amountInVnd))
					{
						decimal amount = amountInVnd / 100m;
						return Redirect($"{successUrl}?amount={amount}");
					}
					return Redirect(successUrl);
				}
				else
				{
					return Redirect($"{failureUrl}?errorCode={responseCode}");
				}
			}
			catch (Exception ex)
			{
				return Redirect($"{failureUrl}?errorCode=system_error&message={WebUtility.UrlEncode(ex.Message)}");
			}
		}

		/// <summary>
		///  Thanh toán booking bằng ví
		/// </summary>
		/// <param name="bookingId"></param>
		/// <returns></returns>
		[HttpPost("payment/process/{bookingId}")]
		[Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> ProcessWalletPayment(int bookingId)
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

				var result = await _paymentService.ProcessWalletPaymentAsync(userId, bookingId);

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