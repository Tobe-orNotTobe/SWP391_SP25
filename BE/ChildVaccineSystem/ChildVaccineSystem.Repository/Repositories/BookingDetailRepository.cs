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
    public class BookingDetailRepository : Repository<BookingDetail>, IBookingDetailRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public BookingDetailRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookingDetail>> GetBookingDetailsByBookingIdAsync(int bookingId)
        {
            return await _context.BookingDetails
                .Where(d => d.BookingId == bookingId)
                .Include(d => d.Vaccine)
                .Include(d => d.ComboVaccine)
                .ToListAsync();
        }
    }
}
