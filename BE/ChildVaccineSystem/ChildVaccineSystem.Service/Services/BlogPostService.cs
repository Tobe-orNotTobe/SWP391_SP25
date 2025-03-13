using AutoMapper;
using ChildVaccineSystem.Data.DTO.Blog;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BlogPostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BlogPostDTO>> GetAllPostsAsync(bool onlyActive = true)
        {
            var blogPosts = await _unitOfWork.BlogPosts.GetAllPostsAsync(onlyActive);  // Pass the flag to repository
            return _mapper.Map<IEnumerable<BlogPostDTO>>(blogPosts);
        }

        public async Task<BlogPostDTO> GetPostByIdAsync(int id)
        {
            var blogPost = await _unitOfWork.BlogPosts.GetPostByIdAsync(id);
            return _mapper.Map<BlogPostDTO>(blogPost);
        }

        public async Task<BlogPostDTO> CreatePostAsync(CreateBlogPostDTO createPostDto)
        {
            var blogPost = new BlogPost
            {
                Title = createPostDto.Title,
                Content = createPostDto.Content,
                ImageUrl = createPostDto.ImageUrl,
                AuthorName = createPostDto.AuthorName,
                Type = createPostDto.Type,  // Handling Type field
                IsActive = false,  // Default value to false for newly created posts
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.BlogPosts.AddAsync(blogPost);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<BlogPostDTO>(blogPost);
        }

        public async Task<BlogPostDTO> UpdatePostAsync(int id, UpdateBlogPostDTO updatePostDto)
        {
            var blogPost = await _unitOfWork.BlogPosts.GetPostByIdAsync(id);
            if (blogPost == null)
            {
                throw new ArgumentException("Không tìm thấy bài đăng trên blog\r\n");
            }

            blogPost.Title = updatePostDto.Title;
            blogPost.Content = updatePostDto.Content;
            blogPost.ImageUrl = updatePostDto.ImageUrl;
            blogPost.Type = updatePostDto.Type;  // Handle updating Type field
            blogPost.IsActive = updatePostDto.IsActive;

            await _unitOfWork.CompleteAsync();

            return _mapper.Map<BlogPostDTO>(blogPost);
        }

        public async Task<bool> DeletePostAsync(int id)
        {
            var blogPost = await _unitOfWork.BlogPosts.GetPostByIdAsync(id);
            if (blogPost == null)
            {
                throw new ArgumentException("Không tìm thấy bài đăng trên blog");
            }

            _unitOfWork.BlogPosts.DeleteAsync(blogPost);
            await _unitOfWork.CompleteAsync();

            return true;
        }
        public async Task<List<BlogPostBasicDTO>> GetBlogBasicAsync()
        {
            var blogs = await _unitOfWork.BlogPosts.GetAllAsync();

            var result = _mapper.Map<List<BlogPostBasicDTO>>(blogs);

            return result;
        }
        // ✅ Lấy blog theo type
        public async Task<List<BlogPostDTO>> GetBlogsByTypeAsync(string type)
        {
            var blogs = await _unitOfWork.BlogPosts.GetAllAsync(b => b.Type == type);

            if (blogs == null || !blogs.Any())
                throw new ArgumentException($"Không tìm thấy blog nào có loại '{type}'");

            return _mapper.Map<List<BlogPostDTO>>(blogs);
        }
    }
}
