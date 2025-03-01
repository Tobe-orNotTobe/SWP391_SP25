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
                .ThenInclude(d => d.Vaccine)  // Nếu có vaccine
                .Include(b => b.BookingDetails)
                .ThenInclude(d => d.ComboVaccine)  // Nếu có combo vaccine
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }
    }
}
