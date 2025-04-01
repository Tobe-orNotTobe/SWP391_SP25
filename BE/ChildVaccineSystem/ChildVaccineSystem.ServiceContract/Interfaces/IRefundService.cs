using ChildVaccineSystem.Data.DTO.Refund;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IRefundService
	{
		Task<List<RefundRequestDTO>> GetAllRefundRequestsAsync();
		Task<RefundRequestDTO> GetRefundRequestByIdAsync(int id);
		Task<List<RefundRequestDTO>> GetUserRefundRequestsAsync(string userId);
		Task<RefundRequestDTO> CreateRefundRequestAsync(string userId, CreateRefundRequestDTO createDto);
		Task<RefundRequestDTO> ApproveRefundRequestAsync(int id, string adminId);
		Task<RefundRequestDTO> RejectRefundRequestAsync(int id, string adminId, ProcessRefundRequestDTO processDto);
	}
}