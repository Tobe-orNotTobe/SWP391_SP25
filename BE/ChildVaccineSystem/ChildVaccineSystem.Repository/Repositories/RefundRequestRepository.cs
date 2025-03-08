using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class RefundRequestRepository : Repository<RefundRequest>, IRefundRequestRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public RefundRequestRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

		public async Task<RefundRequest> GetByIdAsync(int id)
		{
			return await _context.RefundRequests
				.Include(r => r.User)
				.Include(r => r.Booking)
				.Include(r => r.ProcessedBy)
				.FirstOrDefaultAsync(r => r.RefundRequestId == id);
		}

		public async Task<List<RefundRequest>> GetAllAsync(string status = null)
		{
			var query = _context.RefundRequests
				.Include(r => r.User)
				.Include(r => r.Booking)
				.Include(r => r.ProcessedBy)
				.AsQueryable();

			if (!string.IsNullOrEmpty(status))
			{
				query = query.Where(r => r.Status == status);
			}

			return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
		}

		public async Task<List<RefundRequest>> GetByUserIdAsync(string userId)
		{
			return await _context.RefundRequests
				.Include(r => r.Booking)
				.Where(r => r.UserId == userId)
				.OrderByDescending(r => r.CreatedAt)
				.ToListAsync();
		}

		public async Task<List<RefundRequest>> GetByBookingIdAsync(int bookingId)
		{
			return await _context.RefundRequests
				.Include(r => r.User)
				.Where(r => r.BookingId == bookingId)
				.OrderByDescending(r => r.CreatedAt)
				.ToListAsync();
		}

		public async Task<bool> HasExistingRequestForBookingAsync(int bookingId)
		{
			return await _context.RefundRequests
				.AnyAsync(r => r.BookingId == bookingId && r.Status == "Pending");
		}

		public async Task<RefundRequest> CreateAsync(RefundRequest refundRequest)
		{
			await _context.RefundRequests.AddAsync(refundRequest);
			await _context.SaveChangesAsync();
			return refundRequest;
		}

		public async Task<RefundRequest> UpdateAsync(RefundRequest refundRequest)
		{
			_context.RefundRequests.Update(refundRequest);
			await _context.SaveChangesAsync();
			return refundRequest;
		}
	}
}