using System;
using System.ComponentModel.DataAnnotations;

namespace ChildVaccineSystem.Data.Entities
{
    public class BlogPost
    {
        [Key]
        public int BlogPostId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public string ImageUrl { get; set; }

        [Required]
        public string AuthorName { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required]
        public string Type { get; set; } 

        public bool IsActive { get; set; } = false; 
    }
}
