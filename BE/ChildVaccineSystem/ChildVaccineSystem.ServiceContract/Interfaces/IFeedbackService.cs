using ChildVaccineSystem.Data.DTO.Feedback;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IFeedbackService
    {
        Task<FeedbackDTO> GetFeedbackByBookingIdAsync(int bookingId);
        Task<FeedbackDTO> AddFeedbackAsync(CreateFeedbackDTO feedbackDto, string userId, string userName);
        Task<FeedbackDTO> UpdateFeedbackAsync(int bookingId, UpdateFeedbackDTO feedbackDto);
        Task<bool> DeleteFeedbackAsync(int bookingId);
        Task<IEnumerable<FeedbackDTO>> GetAllFeedbackAsync();
    }

}
