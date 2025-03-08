import React from "react";
import {BlogResponse} from "../../interfaces/Blog.ts";
// import {useGetAllBlog} from "../../hooks/useBlog.ts";
// import {BlogResponse} from "../../interfaces/Blog.ts";
import "./BlogPost.scss"

const BlogPost: React.FC<{ blog: BlogResponse | null}> = ({ blog }) => {
    if (!blog) return null;
    return (
        <div className="blog-card">
            <img src={blog.imageUrl} alt={blog.title} className="blog-image"/>
            <div className="blog-content">
                <p className="blog-meta">
                    By {blog.authorName} - {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div className="blog-text" dangerouslySetInnerHTML={{__html: blog.content}}></div>
                <button className="blog-button">Xem thêm</button>
            </div>
        </div>

    );
};

export default BlogPost;
