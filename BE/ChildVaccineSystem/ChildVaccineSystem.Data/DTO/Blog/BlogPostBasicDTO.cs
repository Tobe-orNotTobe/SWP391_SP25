using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.DTO.Blog
{
    public class BlogPostBasicDTO
    {
        public int BlogPostId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string Type { get; set; }
    }
}
