using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public BookingRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> HasConflictingBookingAsync(string userId, DateTime bookingDate)
        {
            return await _context.Bookings
                .AnyAsync(b => b.UserId == userId &&
                             b.BookingDate.Date == bookingDate.Date &&
                             b.Status != BookingStatus.Cancelled);
        }

        public async Task<Booking> GetBookingWithDetailsAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                    .ThenInclude(d => d.Vaccine)
                .Include(b => b.BookingDetails)
                    .ThenInclude(d => d.ComboVaccine)
                .Include(b => b.Children) // ✅ Thêm để ánh xạ ChildName
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }

        public async Task<List<Booking>> GetUnassignedBookingsAsync()
        {
            return await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed && b.DoctorWorkScheduleId == null)
                .Include(b => b.Children)
                .Include(b => b.User)
                .ToListAsync();
        }

        public async Task<bool> IsDoctorAssignedToBookingAsync(int bookingId, string doctorId)
        {
            return await (from b in _context.Bookings
                          join dws in _context.DoctorWorkSchedules
                          on b.DoctorWorkScheduleId equals dws.DoctorWorkScheduleId
                          where b.BookingId == bookingId && dws.UserId == doctorId
                          select b).AnyAsync();
        }

    }
}
