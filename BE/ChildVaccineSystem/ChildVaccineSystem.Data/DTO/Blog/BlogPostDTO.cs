namespace ChildVaccineSystem.Data.DTO.Blog
{
    public class BlogPostDTO
    {
        public int BlogPostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } 

        public string Type { get; set; } 
        public bool IsActive { get; set; } 
    }
}
