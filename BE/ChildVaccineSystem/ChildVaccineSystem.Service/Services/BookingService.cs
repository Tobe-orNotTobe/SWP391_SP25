using AutoMapper;
using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
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
        public async Task<BookingDTO> GetByIdAsync(int id)
        {
            var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == id, includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User");
            if (booking == null)
                throw new ArgumentException($"Booking with ID {id} not found");

            return _mapper.Map<BookingDTO>(booking);
        }

        public async Task<BookingDTO> CreateAsync(string userId, CreateBookingDTO bookingDto)
        {
            await ValidateBooking(userId, bookingDto);

            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            booking.BookingDetails = new List<BookingDetail>();

            decimal totalPrice = 0;

            foreach (var detailDto in bookingDto.BookingDetails)
            {
                var bookingDetail = _mapper.Map<BookingDetail>(detailDto);

                if (detailDto.VaccineId.HasValue)
                {
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detailDto.VaccineId);
                    bookingDetail.Price = vaccine.Price;
                }
                else
                {
                    var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detailDto.ComboVaccineId);
                    bookingDetail.Price = comboVaccine.TotalPrice;
                }

                booking.BookingDetails.Add(bookingDetail);
                totalPrice += bookingDetail.Price;
            }

            booking.TotalPrice = totalPrice;

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();

            return await GetByIdAsync(booking.BookingId);
        }

        public async Task<List<BookingDTO>> GetUserBookingsAsync(string userId)
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync(b => b.UserId == userId, includeProperties: "BookingDetails.Vaccine,BookingDetails.ComboVaccine,Children,User");
            return _mapper.Map<List<BookingDTO>>(bookings);
        }

        private async Task ValidateBooking(string userId, CreateBookingDTO bookingDto)
        {
            // Validate booking date
            if (bookingDto.BookingDate < DateTime.Now)
                throw new ArgumentException("Booking date cannot be in the past");

            // Check for conflicting bookings
            if (await _unitOfWork.Bookings.HasConflictingBookingAsync(userId, bookingDto.BookingDate))
                throw new InvalidOperationException("User already has a booking for this date");

            // Validate child exists
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == bookingDto.ChildId);
            if (child == null)
                throw new ArgumentException("Child not found");

            // Validate booking details exist
            if (!bookingDto.BookingDetails.Any())
                throw new ArgumentException("Booking must contain at least one vaccine or combo vaccine");

            // Validate booking type consistency
            bool hasVaccine = bookingDto.BookingDetails.Any(bd => bd.VaccineId.HasValue);
            bool hasComboVaccine = bookingDto.BookingDetails.Any(bd => bd.ComboVaccineId.HasValue);

            if (hasVaccine && hasComboVaccine)
                throw new ArgumentException("Cannot mix individual vaccines and combo vaccines in the same booking");

            if (!hasVaccine && !hasComboVaccine)
                throw new ArgumentException("Booking must specify either vaccines or combo vaccines");

            // Validate vaccines
            foreach (var detail in bookingDto.BookingDetails)
            {
                if (detail.VaccineId.HasValue)
                {
                    var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == detail.VaccineId);
                    if (vaccine == null)
                        throw new ArgumentException($"Vaccine not found: {detail.VaccineId}");
                }
                else if (detail.ComboVaccineId.HasValue)
                {
                    var comboVaccine = await _unitOfWork.ComboVaccines.GetAsync(cv => cv.ComboId == detail.ComboVaccineId);
                    if (comboVaccine == null)
                        throw new ArgumentException($"Combo vaccine not found: {detail.ComboVaccineId}");
                }
            }
        }
    }
}
