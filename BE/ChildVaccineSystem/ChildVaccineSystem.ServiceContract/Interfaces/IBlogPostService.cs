using ChildVaccineSystem.Data.DTO.Blog;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IBlogPostService
    {
        Task<IEnumerable<BlogPostDTO>> GetAllPostsAsync(bool onlyActive = true);  
        Task<BlogPostDTO> GetPostByIdAsync(int id);
        Task<BlogPostDTO> CreatePostAsync(CreateBlogPostDTO createPostDto);
        Task<BlogPostDTO> UpdatePostAsync(int id, UpdateBlogPostDTO updatePostDto);
        Task<bool> DeletePostAsync(int id);
        Task<List<BlogPostBasicDTO>> GetBlogBasicAsync();
        Task<List<BlogPostDTO>> GetBlogsByTypeAsync(string type);

    }
}
