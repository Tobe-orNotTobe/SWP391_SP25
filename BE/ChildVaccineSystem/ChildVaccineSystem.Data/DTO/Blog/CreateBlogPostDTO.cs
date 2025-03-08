using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.DTO.Blog
{
    public class CreateBlogPostDTO
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public string ImageUrl { get; set; }

        [Required]
        public string AuthorName { get; set; }

        [Required]
        public string Type { get; set; } 

    }
}
