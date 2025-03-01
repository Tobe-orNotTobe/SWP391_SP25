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
    public class FeedbackRepository : Repository<Feedback>, IFeedbackRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public FeedbackRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Feedback> GetFeedbackByBookingIdAsync(int bookingId)
        {
            return await _context.Feedbacks
                .Where(f => f.BookingId == bookingId)
                .FirstOrDefaultAsync();
        }
    }

}
