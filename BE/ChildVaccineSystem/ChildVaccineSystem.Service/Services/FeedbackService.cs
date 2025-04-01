using AutoMapper;
using ChildVaccineSystem.Data.DTO.Feedback;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FeedbackService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<FeedbackDTO> GetFeedbackByBookingIdAsync(int bookingId)
        {
            var feedback = await _unitOfWork.Feedbacks.GetFeedbackByBookingIdAsync(bookingId);
            if (feedback == null)
                throw new ArgumentException($"Không tìm thấy phản hồi nào cho việc đặt phòng bằng ID {bookingId}");

            return _mapper.Map<FeedbackDTO>(feedback);
        }

        public async Task<FeedbackDTO> AddFeedbackAsync(CreateFeedbackDTO feedbackDto, string userId, string userName)
        {
            var existingFeedback = await _unitOfWork.Feedbacks.GetAsync(f => f.BookingId == feedbackDto.BookingId);
            if (existingFeedback != null)
            {
                throw new ArgumentException($"Phản hồi cho việc đặt chỗ ID {feedbackDto.BookingId} đã tồn tại.");
            }

            var feedback = new Feedback
            {
                BookingId = feedbackDto.BookingId,
                UserId = userId,
                Rating = feedbackDto.Rating,
                Comment = feedbackDto.Comment,
                DateSubmitted = DateTime.UtcNow
            };

            await _unitOfWork.Feedbacks.AddAsync(feedback);
            await _unitOfWork.CompleteAsync();

            var feedbackDTO = _mapper.Map<FeedbackDTO>(feedback);
            feedbackDTO.UserName = userName;
            return feedbackDTO;
        }

        public async Task<FeedbackDTO> UpdateFeedbackAsync(int bookingId, UpdateFeedbackDTO updateFeedbackDto)
        {
            var feedback = await _unitOfWork.Feedbacks.GetAsync(f => f.BookingId == bookingId);
            if (feedback == null)
            {
                throw new ArgumentException($"Không tìm thấy phản hồi nào cho việc đặt phòng bằng ID {bookingId}");
            }

            feedback.Rating = updateFeedbackDto.Rating;
            feedback.Comment = updateFeedbackDto.Comment;

            await _unitOfWork.CompleteAsync();

            return _mapper.Map<FeedbackDTO>(feedback);
        }

        public async Task<bool> DeleteFeedbackAsync(int bookingId)
        {
            var feedback = await _unitOfWork.Feedbacks.GetAsync(f => f.BookingId == bookingId);
            if (feedback == null)
            {
                return false; // Feedback not found
            }

            await _unitOfWork.Feedbacks.DeleteAsync(feedback);
            await _unitOfWork.CompleteAsync();
            return true;
        }
        public async Task<IEnumerable<FeedbackDTO>> GetAllFeedbackAsync()
        {
            var feedbacks = await _unitOfWork.Feedbacks.GetAllAsync(includeProperties: "User,Booking");

            var feedbackDtos = _mapper.Map<IEnumerable<FeedbackDTO>>(feedbacks);

            foreach (var feedbackDto in feedbackDtos)
            {
                var user = feedbacks.FirstOrDefault(f => f.FeedbackId == feedbackDto.FeedbackId)?.User;
                if (user != null)
                {
                    feedbackDto.UserName = user.UserName;
                }
            }

            return feedbackDtos;
        }


    }

}
