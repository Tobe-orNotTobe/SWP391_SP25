using AutoMapper;
using ChildVaccineSystem.Data.DTO.Refund;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
	public class RefundService : IRefundService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;
		private readonly IWalletService _walletService;

		public RefundService(IUnitOfWork unitOfWork, IMapper mapper, IWalletService walletService)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
			_walletService = walletService;
		}

		public async Task<List<RefundRequestDTO>> GetAllRefundRequestsAsync(string status = null)
		{
			var refundRequests = await _unitOfWork.RefundRequests.GetAllAsync(status);
			return _mapper.Map<List<RefundRequestDTO>>(refundRequests);
		}

		public async Task<RefundRequestDTO> GetRefundRequestByIdAsync(int id)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(id);
			if (refundRequest == null)
			{
				throw new KeyNotFoundException($"Refund request with ID {id} not found.");
			}

			return _mapper.Map<RefundRequestDTO>(refundRequest);
		}

		public async Task<List<RefundRequestDTO>> GetUserRefundRequestsAsync(string userId)
		{
			var refundRequests = await _unitOfWork.RefundRequests.GetByUserIdAsync(userId);
			return _mapper.Map<List<RefundRequestDTO>>(refundRequests);
		}

		public async Task<RefundRequestDTO> CreateRefundRequestAsync(string userId, CreateRefundRequestDTO createDto)
		{
			// Verify booking exists
			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == createDto.BookingId);
			if (booking == null)
			{
				throw new KeyNotFoundException($"Booking with ID {createDto.BookingId} not found.");
			}

			// Check if the booking belongs to this user
			if (booking.UserId != userId)
			{
				throw new UnauthorizedAccessException("You are not authorized to request a refund for this booking.");
			}

			// Check booking status - only allow refunds for certain statuses
			if (booking.Status != BookingStatus.Confirmed && booking.Status != BookingStatus.Completed && booking.Status != BookingStatus.Pending)
			{
				throw new InvalidOperationException($"Cannot request refund for booking in {booking.Status} status.");
			}

			// Check if there's already a pending refund request
			if (await _unitOfWork.RefundRequests.HasExistingRequestForBookingAsync(createDto.BookingId))
			{
				throw new InvalidOperationException("There is already a pending refund request for this booking.");
			}

			// Tính toán số tiền hoàn lại dựa trên số ngày trước lịch tiêm
			var daysUntilAppointment = (booking.BookingDate - DateTime.Now).Days;
			decimal refundAmount = 0;
			string refundPolicy = "";

			if (daysUntilAppointment >= 7)
			{
				refundAmount = booking.TotalPrice;
				refundPolicy = "Full refund (100%) - Cancelled 7 or more days before appointment";
			}
			else if (daysUntilAppointment >= 3 && daysUntilAppointment <= 6)
			{
				refundAmount = booking.TotalPrice * 0.5m;
				refundPolicy = "Partial refund (50%) - Cancelled 3-6 days before appointment";
			}
			else
			{
				refundAmount = 0;
				refundPolicy = "No refund - Cancelled less than 3 days before appointment";
			}

			if (refundAmount <= 0)
			{
				throw new InvalidOperationException($"No refund is available for this booking. {refundPolicy}");
			}

			// Create new refund request
			var refundRequest = new RefundRequest
			{
				BookingId = createDto.BookingId,
				UserId = userId,
				Reason = createDto.Reason,
				Amount = refundAmount,
				Status = "Pending",
				AdminNote = $"Auto-calculated refund: {refundPolicy}",
				CreatedAt = DateTime.UtcNow
			};

			await _unitOfWork.RefundRequests.CreateAsync(refundRequest);
			return _mapper.Map<RefundRequestDTO>(refundRequest);
		}

		public async Task<RefundRequestDTO> ApproveRefundRequestAsync(int id, string adminId)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(id);
			if (refundRequest == null)
			{
				throw new KeyNotFoundException($"Refund request with ID {id} not found.");
			}

			if (refundRequest.Status != "Pending")
			{
				throw new InvalidOperationException($"Cannot approve refund request that is in {refundRequest.Status} status.");
			}

			// Không cho phép điều chỉnh số tiền hoàn lại - sử dụng số tiền đã tính tự động
			decimal refundAmount = refundRequest.Amount;

			using (var transaction = await _unitOfWork.BeginTransactionAsync())
			{
				try
				{
					refundRequest.Status = "Approved";
					refundRequest.ProcessedById = adminId;
					refundRequest.ProcessedAt = DateTime.UtcNow;

					await _unitOfWork.RefundRequests.UpdateAsync(refundRequest);

					await _walletService.ProcessRefundAsync(refundRequest.RefundRequestId, refundAmount, adminId, transaction);

					var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == refundRequest.BookingId);
					if (booking != null)
					{
						booking.Status = BookingStatus.Cancelled;
						await _unitOfWork.CompleteAsync();
					}

					await transaction.CommitAsync();
					return _mapper.Map<RefundRequestDTO>(refundRequest);
				}
				catch (Exception)
				{
					await transaction.RollbackAsync();
					throw;
				}
			}
		}

		public async Task<RefundRequestDTO> RejectRefundRequestAsync(int id, string adminId, ProcessRefundRequestDTO processDto)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(id);
			if (refundRequest == null)
			{
				throw new KeyNotFoundException($"Refund request with ID {id} not found.");
			}

			if (refundRequest.Status != "Pending")
			{
				throw new InvalidOperationException($"Cannot reject refund request that is in {refundRequest.Status} status.");
			}

			// Update refund request
			refundRequest.Status = "Rejected";
			refundRequest.ProcessedById = adminId;
			refundRequest.ProcessedAt = DateTime.UtcNow;
			refundRequest.AdminNote = processDto.AdminNote;

			await _unitOfWork.RefundRequests.UpdateAsync(refundRequest);
			return _mapper.Map<RefundRequestDTO>(refundRequest);
		}
	}
}