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
    }
}
