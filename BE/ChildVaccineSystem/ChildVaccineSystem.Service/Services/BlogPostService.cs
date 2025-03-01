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

        public async Task<IEnumerable<BlogPostDTO>> GetAllPostsAsync()
        {
            var blogPosts = await _unitOfWork.BlogPosts.GetAllPostsAsync();
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
                throw new ArgumentException("Blog post not found");
            }

            blogPost.Title = updatePostDto.Title;
            blogPost.Content = updatePostDto.Content;
            blogPost.ImageUrl = updatePostDto.ImageUrl;

            await _unitOfWork.CompleteAsync();

            return _mapper.Map<BlogPostDTO>(blogPost);
        }

        public async Task<bool> DeletePostAsync(int id)
        {
            var blogPost = await _unitOfWork.BlogPosts.GetPostByIdAsync(id);
            if (blogPost == null)
            {
                throw new ArgumentException("Blog post not found");
            }

            _unitOfWork.BlogPosts.DeleteAsync(blogPost);
            await _unitOfWork.CompleteAsync();

            return true;
        }
    }
}
