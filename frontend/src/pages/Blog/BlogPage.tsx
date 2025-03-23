import React, { useEffect, useState } from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import { useGetAllBlog } from "../../hooks/useBlog.ts";
import { BlogResponse } from "../../interfaces/Blog.ts";
import BlogPost from "../../components/Blog/BlogPost.tsx";
import "./Blog.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import {Link, useNavigate} from "react-router-dom";

const BlogPage: React.FC = () => {
    const { blogs, fetchAllBlog } = useGetAllBlog();
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 9;

    useEffect(() => {
        fetchAllBlog(true, "blog").then();
    }, []);


    const mainBlog = blogs.length > 0 ? blogs[0] : null;
    const startIndex = (currentPage - 1) * (blogsPerPage - 1) + 1;
    const endIndex = startIndex + (blogsPerPage - 1);
    const paginatedBlogs = blogs.slice(startIndex, endIndex);
    const totalPages = Math.ceil((blogs.length - 1) / (blogsPerPage - 1));
    const navigate = useNavigate();

    return (
        <>
            <CustomerNavbar />
            <div style={{display: "grid", justifyContent: "center"}}>
                <span style={{paddingTop: "30px"}}>
                    <Link style={{textDecoration: "none", color: "#2A388F"}}
                          to="/homepage">Trang chủ</Link>
                    <span className="separator"> » </span>
                    <span className="last">Blog</span>
                </span>

                <div style={{paddingTop: "20px"}} className="introductionTitle">
                    <h1 className="gt-title">Blog</h1>
                </div>

                <div className={"main-blog"} onClick={() => navigate(`/blog/${mainBlog?.blogPostId}`)}>
                    {mainBlog && currentPage === 1 && (
                        <div className={"main-blog-container"}>
                            <img src={mainBlog.imageUrl} alt={mainBlog.title} className="blog-image"/>
                            <div className="blog-content">
                                <div className="blog-text" dangerouslySetInnerHTML={{__html: mainBlog.content}}></div>
                                <p className="blog-meta">
                                    By {mainBlog.authorName} - {new Date(mainBlog.createdAt).toLocaleDateString()}
                                </p>
                                <div>
                                    <button className="blog-button">Xem thêm</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Danh sách blog phụ */}
                <div className="blog-grid-container">
                    {paginatedBlogs.map((blog: BlogResponse) => (
                        <div key={blog.blogPostId} className="blog-card-wrapper">
                            <BlogPost blog={blog}/>
                        </div>
                    ))}
                </div>


                <div className="pagination-container">
                    <button
                        className="pagination-button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FaArrowLeftLong/>
                    </button>

                    {Array.from({length: totalPages}, (_, index) => index + 1)
                        .filter(page => page >= currentPage - 1 && page <= currentPage + 1) // Hiển thị 3 trang xung quanh trang hiện tại
                        .map(page => (
                            <button
                                key={page}
                                className={`page-number ${page === currentPage ? "active-page" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                    <button
                        className="pagination-button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <FaArrowRightLong/>
                    </button>
                </div>
            </div>
            <Footer/>
            <FloatingButtons/>
        </>
    );
};

export default BlogPage;
