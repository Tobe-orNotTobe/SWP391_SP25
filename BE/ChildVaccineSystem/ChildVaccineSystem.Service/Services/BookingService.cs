using AutoMapper;
using ChildVaccineSystem.Data.DTO.Booking;
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
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BookingDTO> CreateAsync(BookingDTO bookingDto)
        {
            var booking = _mapper.Map<Booking>(bookingDto);
            var createdBooking = await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<BookingDTO>(createdBooking);
        }

        public async Task<IEnumerable<BookingDTO>> GetUserBookingsAsync(string userId)
        {
            var bookings = await _unitOfWork.Bookings.GetUserBookingsAsync(userId);
            return _mapper.Map<IEnumerable<BookingDTO>>(bookings);
        }

        public async Task<BookingDTO> GetBookingWithDetailsAsync(int bookingId)
        {
            var booking = await _unitOfWork.Bookings.GetBookingWithDetailsAsync(bookingId);
            return _mapper.Map<BookingDTO>(booking);
        }
    }

}
