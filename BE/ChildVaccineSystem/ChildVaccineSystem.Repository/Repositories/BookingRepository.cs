using ChildVaccineSystem.Data.Entities;
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

        public async Task<IEnumerable<Booking>> GetUserBookingsAsync(string userId)
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task<Booking> GetBookingWithDetailsAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                .ThenInclude(d => d.Vaccine)
                .Include(b => b.BookingDetails)
                .ThenInclude(d => d.ComboVaccine)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }
    }
}
