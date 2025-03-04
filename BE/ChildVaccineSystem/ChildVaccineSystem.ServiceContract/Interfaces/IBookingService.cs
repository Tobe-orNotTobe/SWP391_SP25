using ChildVaccineSystem.Data.DTO.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IBookingService
    {
        Task<BookingDTO> GetByIdAsync(int id);
        Task<BookingDTO> CreateAsync(string userId, CreateBookingDTO bookingDto);
        Task<List<BookingDTO>> GetUserBookingsAsync(string userId);
        Task<BookingDTO> CancelBookingAsync(int bookingId, string userId);
        Task<bool> AssignDoctorToBooking(int bookingId, string userId);
        Task<List<BookingDTO>> GetDoctorBookingsAsync(string userId);
        Task<BookingDTO> CompleteBookingAsync(int bookingId, string doctorId);
        Task<List<BookingDTO>> GetUnassignedBookingsAsync();

    }
}
