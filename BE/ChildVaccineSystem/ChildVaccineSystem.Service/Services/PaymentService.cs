using ChildVaccineSystem.Data.DTO.Payment;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
	public class PaymentService : IPaymentService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IWalletService _walletService;

		public PaymentService(IUnitOfWork unitOfWork, IWalletService walletService)
		{
			_unitOfWork = unitOfWork;
			_walletService = walletService;
		}

		public async Task<WalletPaymentResponseDTO> ProcessWalletPaymentAsync(string userId, int bookingId)
		{
			// Validate booking exists and belongs to user
			if (!await ValidateBookingForPaymentAsync(bookingId, userId))
			{
				throw new UnauthorizedAccessException("lịch hẹn không hợp lệ hoặc bạn không được phép thanh toán cho lịch hẹn này!");
			}

			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);

			var wallet = await _walletService.GetUserWalletAsync(userId);

			if (wallet.Balance <= 0)
			{
				throw new InvalidOperationException("Số dư ví của bạn đang trống. Vui lòng thêm nạp tiền vào ví!");
			}

			decimal amountToPay = booking.TotalPrice;

			if (wallet.Balance < amountToPay)
			{
				throw new InvalidOperationException($"Số dư ví không đủ. Hiện có: {wallet.Balance:C}, cần trả: {amountToPay:C}!");
			}

			try
			{
				bool success = await _walletService.PayFromWalletAsync(bookingId, userId, amountToPay);

				if (success)
				{
					booking.Status = BookingStatus.Confirmed;

					// Create a transaction record
					var transaction = new Transaction
					{
						BookingId = booking.BookingId,
						UserId = userId,
						CreatedAt = DateTime.UtcNow,
						PaymentMethod = "Ví",
						Status = "Hoàn thành",
						Amount = amountToPay
					};

					await _unitOfWork.Transactions.AddAsync(transaction);
					await _unitOfWork.CompleteAsync();

					// Get updated wallet balance
					var updatedWallet = await _walletService.GetUserWalletAsync(userId);

					return new WalletPaymentResponseDTO
					{
						Success = true,
						Message = "Thanh toán đã được xử lý thành công",
						BookingId = booking.BookingId,
						AmountPaid = amountToPay,
						RemainingWalletBalance = updatedWallet.Balance,
						PaymentDate = DateTime.UtcNow,
						TransactionId = transaction.TransactionId.ToString()
					};
				}
				else
				{
					return new WalletPaymentResponseDTO
					{
						Success = false,
						Message = "Thanh toán thất bại",
						BookingId = booking.BookingId,
						AmountPaid = 0
					};
				}
			}
			catch (InvalidOperationException ex)
			{
				return new WalletPaymentResponseDTO
				{
					Success = false,
					Message = ex.Message,
					BookingId = booking.BookingId,
					AmountPaid = 0
				};
			}
		}

		private async Task<bool> ValidateBookingForPaymentAsync(int bookingId, string userId)
		{
			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);

			if (booking == null)
			{
				return false;
			}

			// Check if booking belongs to user
			if (booking.UserId != userId)
			{
				return false;
			}

			return booking.Status == BookingStatus.Pending;
		}
	}
}