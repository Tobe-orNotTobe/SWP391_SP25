using ChildVaccineSystem.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IBlogPostRepository : IRepository<BlogPost>
    {
        Task<IEnumerable<BlogPost>> GetAllPostsAsync(bool onlyActive = false);  
        Task<BlogPost> GetPostByIdAsync(int id);
    }
}
