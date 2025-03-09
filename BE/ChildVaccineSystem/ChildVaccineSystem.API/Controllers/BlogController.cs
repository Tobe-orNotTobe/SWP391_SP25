using AutoMapper;
using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Blog;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;
        private readonly APIResponse _response;

        public BlogController(IBlogPostService blogPostService, APIResponse response)
        {
            _blogPostService = blogPostService;
            _response = response;
        }

        // Get all posts, only active ones by default
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> GetAllPosts([FromQuery] bool onlyActive = true)
        {
            try
            {
                var posts = await _blogPostService.GetAllPostsAsync(onlyActive);  
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = posts;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error retrieving posts: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Create a new blog post
        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<APIResponse>> CreatePost([FromBody] CreateBlogPostDTO createPostDto)
        {
            try
            {
                var createdPost = await _blogPostService.CreatePostAsync(createPostDto);
                _response.StatusCode = HttpStatusCode.Created;
                _response.IsSuccess = true;
                _response.Result = createdPost;
                return CreatedAtAction(nameof(GetPostById), new { id = createdPost.BlogPostId }, _response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error creating post: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Get a single post by ID
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetPostById(int id)
        {
            try
            {
                var post = await _blogPostService.GetPostByIdAsync(id);
                if (post == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Post not found.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = post;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error retrieving post: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Update a blog post
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> UpdatePost(int id, [FromBody] UpdateBlogPostDTO updatePostDto)
        {
            try
            {
                var updatedPost = await _blogPostService.UpdatePostAsync(id, updatePostDto);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = updatedPost;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error updating post: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        // Delete a blog post
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> DeletePost(int id)
        {
            try
            {
                var result = await _blogPostService.DeletePostAsync(id);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = result;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Error deleting post: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }
        //get basic
        [HttpGet("basic")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBlogBasic()
        {
            var blogs = await _blogPostService.GetBlogBasicAsync();
            return Ok(blogs);
        }
    }
}
