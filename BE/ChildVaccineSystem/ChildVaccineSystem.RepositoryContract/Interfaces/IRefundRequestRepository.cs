using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface IRefundRequestRepository : IRepository<RefundRequest>
	{
		Task<RefundRequest> GetByIdAsync(int id);
		Task<List<RefundRequest>> GetAllAsync();
		Task<List<RefundRequest>> GetByUserIdAsync(string userId);
		Task<List<RefundRequest>> GetByBookingIdAsync(int bookingId);
		Task<bool> HasExistingRequestForBookingAsync(int bookingId);
		Task<RefundRequest> CreateAsync(RefundRequest refundRequest);
		Task<RefundRequest> UpdateAsync(RefundRequest refundRequest);
	}
}