using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;
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
		Task<List<string>> CheckParentVaccinesInBookingAsync(List<int> bookingDetailIds);
		Task<BookingDTO> CreateAsync(string userId, CreateBookingDTO bookingDto);
		Task<List<BookingDTO>> GetUserBookingsAsync(string userId);
		Task<BookingDTO> CancelBookingAsync(int bookingId, string userId);
		Task<bool> AssignDoctorToBooking(int bookingId, string userId);
		//Task<List<BookingDTO>> GetDoctorBookingsAsync(string userId);
		// Task<BookingDTO> CompleteBookingAsync(int bookingId, string doctorId);
		Task<List<BookingDTO>> GetUnassignedBookingsAsync();
		Task<List<BookingDTO>> GetAllBookingsAsync();
		Task<bool> UnassignDoctorFromBookingAsync(int bookingId, string userId);

        Task<bool> CompleteBookingDetailAsync(int bookingDetailId);
        Task<List<BookingDetailDTO>> GetDoctorBookingDetailsAsync(string userId);
        Task<List<BookingDetailDTO>> GetAllBookingDetailsByUserIdAsync(string userId);

    }
}
