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

		public async Task<List<RefundRequestDTO>> GetAllRefundRequestsAsync()
		{
			var refundRequests = await _unitOfWork.RefundRequests.GetAllAsync();

			return _mapper.Map<List<RefundRequestDTO>>(refundRequests);
		}

		public async Task<RefundRequestDTO> GetRefundRequestByIdAsync(int id)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(id);

			if (refundRequest == null)
			{
				throw new KeyNotFoundException($"Không tìm thấy yêu cầu hoàn tiền!");
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
				throw new KeyNotFoundException($"Không tìm thấy lịch hẹn này!");
			}

			// Check if the booking belongs to this user
			if (booking.UserId != userId)
			{
				throw new UnauthorizedAccessException("Bạn không được phép yêu cầu hoàn lại tiền cho đơn đặt lịch này!");
			}

			// Check booking status - only allow refunds for certain statuses
			if (booking.Status != BookingStatus.Confirmed)
			{
				throw new InvalidOperationException($"Không thể yêu cầu hoàn tiền cho đơn đặt lịch có trạng thái {booking.Status}!");
			}

			// Check if there's already a pending refund request
			if (await _unitOfWork.RefundRequests.HasExistingRequestForBookingAsync(createDto.BookingId))
			{
				throw new InvalidOperationException("Đã có yêu cầu hoàn tiền cho đơn lịch hẹn này.");
			}

			// Tính toán số tiền hoàn lại dựa trên số ngày trước lịch tiêm
			var daysUntilAppointment = (booking.BookingDate - DateTime.Now).Days;

			decimal refundAmount = 0;

			string refundPolicy = "";

			if (daysUntilAppointment >= 7)
			{
				refundAmount = booking.TotalPrice;
				refundPolicy = "Hoàn tiền đầy đủ (100%) - Hủy trước 7 ngày hoặc hơn so với lịch hẹn";
			}
			else if (daysUntilAppointment >= 4 && daysUntilAppointment <= 6)
			{
				refundAmount = booking.TotalPrice * 0.5m;
				refundPolicy = "Hoàn tiền một phần (50%) - Hủy trước 4-6 ngày so với lịch hẹn";
			}
			else
			{
				throw new InvalidOperationException("Không thể yêu cầu hoàn tiền trước 3 ngày!");
			}

			// Create new refund request
			var refundRequest = new RefundRequest
			{
				BookingId = createDto.BookingId,
				UserId = userId,
				Reason = createDto.Reason,
				Amount = refundAmount,
				Status = "Đang chờ xử lý",
				AdminNote = $"Tự động tính toán: {refundPolicy}",
				CreatedAt = DateTime.UtcNow
			};

			await _unitOfWork.RefundRequests.CreateAsync(refundRequest);

			booking.Status = BookingStatus.RequestRefund;
			await _unitOfWork.CompleteAsync();

			return _mapper.Map<RefundRequestDTO>(refundRequest);
		}

		public async Task<RefundRequestDTO> ApproveRefundRequestAsync(int id, string adminId)
		{
			var refundRequest = await _unitOfWork.RefundRequests.GetByIdAsync(id);

			if (refundRequest == null)
			{
				throw new KeyNotFoundException($"Không tìm thấy yêu cầu hoàn tiền với ID {id}!");
			}

			if (refundRequest.Status != "Đang chờ xử lý")
			{
				throw new InvalidOperationException($"Không thể chấp thuận yêu cầu hoàn tiền có trạng thái {refundRequest.Status}!");
			}

			// Không cho phép điều chỉnh số tiền hoàn lại - sử dụng số tiền đã tính tự động
			decimal refundAmount = refundRequest.Amount;

			using (var transaction = await _unitOfWork.BeginTransactionAsync())
			{
				try
				{
					refundRequest.Status = "Đã chấp nhận";
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
				throw new KeyNotFoundException($"Không tìm thấy yêu cầu hoàn tiền!");
			}

			if (refundRequest.Status != "Đang chờ xử lý")
			{
				throw new InvalidOperationException($"Không thể từ chối yêu cầu hoàn tiền có trạng thái {refundRequest.Status}!");
			}

			// Update refund request
			refundRequest.Status = "Bị từ chối";
			refundRequest.ProcessedAt = DateTime.UtcNow;
			refundRequest.AdminNote = processDto.AdminNote;

			await _unitOfWork.RefundRequests.UpdateAsync(refundRequest);

			return _mapper.Map<RefundRequestDTO>(refundRequest);
		}
	}
}