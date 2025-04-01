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

		public async Task<BookingDetail> GetByIdAsync(int id)
		{
			return await _context.BookingDetails
				.Include(bd => bd.Vaccine)
				.Include(bd => bd.VaccineInventory)
				.FirstOrDefaultAsync(bd => bd.BookingDetailId == id);
		}
	}
}
