﻿using ChildVaccineSystem.Data.DTO.Payment;
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

		public async Task<WalletPaymentResponseDTO> ProcessWalletPaymentAsync(string userId, WalletPaymentDTO paymentDto)
		{
			// Validate booking exists and belongs to user
			if (!await ValidateBookingForPaymentAsync(paymentDto.BookingId, userId))
			{
				throw new UnauthorizedAccessException("Invalid booking or you are not authorized to pay for this booking.");
			}

			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == paymentDto.BookingId);

			// Validate payment amount
			if (paymentDto.Amount > booking.TotalPrice)
			{
				throw new InvalidOperationException("Payment amount exceeds booking total price.");
			}

			// Process payment from wallet
			try
			{
				bool success = await _walletService.PayFromWalletAsync(paymentDto.BookingId, userId, paymentDto.Amount);

				if (success)
				{
					booking.Status = BookingStatus.Confirmed;

					// Create a transaction record
					var transaction = new Transaction
					{
						BookingId = booking.BookingId,
						UserId = userId,
						CreatedAt = DateTime.UtcNow,
						PaymentMethod = "Wallet",
						Status = "Completed",
						Amount = paymentDto.Amount
					};

					await _unitOfWork.Transactions.AddAsync(transaction);
					await _unitOfWork.CompleteAsync();

					// Get updated wallet balance
					var walletDto = await _walletService.GetUserWalletAsync(userId);

					return new WalletPaymentResponseDTO
					{
						Success = true,
						Message = "Payment processed successfully",
						BookingId = booking.BookingId,
						AmountPaid = paymentDto.Amount,
						RemainingWalletBalance = walletDto.Balance,
						PaymentDate = DateTime.UtcNow,
						TransactionId = transaction.TransactionId.ToString()
					};
				}
				else
				{
					return new WalletPaymentResponseDTO
					{
						Success = false,
						Message = "Payment processing failed",
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