using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IFeedbackRepository : IRepository<Feedback>
    {
        Task<Feedback> GetFeedbackByBookingIdAsync(int bookingId);
    }

}
