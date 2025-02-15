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
        Task<BookingDTO> CreateAsync(BookingDTO bookingDto);
        Task<IEnumerable<BookingDTO>> GetUserBookingsAsync(string userId);
        Task<BookingDTO> GetBookingWithDetailsAsync(int bookingId);
    }

}
