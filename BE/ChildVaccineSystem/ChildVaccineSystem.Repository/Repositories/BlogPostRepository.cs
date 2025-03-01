using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class BlogPostRepository : Repository<BlogPost>, IBlogPostRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public BlogPostRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogPost>> GetAllPostsAsync()
        {
            return await _context.BlogPosts
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<BlogPost> GetPostByIdAsync(int id)
        {
            return await _context.BlogPosts
                .FirstOrDefaultAsync(b => b.BlogPostId == id);
        }
    }
}
