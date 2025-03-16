using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IBookingRepository : IRepository<Booking>
    {
        Task<bool> HasConflictingBookingAsync(string userId, DateTime bookingDate);
        Task<Booking> GetBookingWithDetailsAsync(int bookingId);
        Task<List<Booking>> GetUnassignedBookingsAsync();
        Task<bool> IsDoctorAssignedToBookingAsync(int bookingId, string doctorId);

    }
}
