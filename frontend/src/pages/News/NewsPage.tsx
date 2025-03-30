import React, { useEffect, useState } from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetAllBlog} from "../../hooks/useBlog.ts";
import { NewsResponse } from "../../interfaces/Blog.ts";
import NewsPost from "../../components/News/NewsPost.tsx";
import "./News.scss";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const NewsPage: React.FC = () => {
    const {news, fetchAllBlog } = useGetAllBlog();
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 9;

    useEffect(() => {
        fetchAllBlog(true, "news").then();
    }, []);



    const mainNews = news.length > 0 ? news[0] : null;
    const startIndex = (currentPage - 1) * (newsPerPage - 1) + 1;
    const endIndex = startIndex + (newsPerPage - 1);
    const paginatedNews = news.slice(startIndex, endIndex);
    const totalPages = Math.ceil((news.length - 1) / (newsPerPage - 1));
    const navigate = useNavigate();

    return (
        <>
            <CustomerNavbar />
            <div style={{ display: "grid", justifyContent: "center" }}>
                <span style={{ paddingTop: "30px" }}>
                    <Link style={{ textDecoration: "none", color: "#2A388F" }} to="/homepage">
                        Trang chủ
                    </Link>
                    <span className="separator"> » </span>
                    <span className="last">Tin tức</span>
                </span>

                <div style={{ paddingTop: "20px" }} className="introductionTitle">
                    <h1 className="gt-title">Tin tức</h1>
                </div>

                <div className="main-news" onClick={() => navigate(`/news/${mainNews?.blogPostId}`)}>
                    {mainNews && currentPage === 1 && (
                        <div className="main-news-container">
                            <img src={mainNews.imageUrl} alt={mainNews.title} className="news-image" />
                            <div className="news-content">
                                <div className="news-text" dangerouslySetInnerHTML={{ __html: mainNews.content }}></div>
                                <p className="news-meta">
                                    By {mainNews.authorName} - {new Date(mainNews.createdAt).toLocaleDateString()}
                                </p>
                                <div>
                                    <button className="news-button">Xem thêm</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Danh sách news phụ */}
                <div className="news-grid-container">
                    {paginatedNews.map((item: NewsResponse) => (
                        <div key={item.blogPostId} className="news-card-wrapper">
                            <NewsPost news={item} />
                        </div>
                    ))}
                </div>

                <div className="pagination-container">
                    <button
                        className="pagination-button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FaArrowLeftLong />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
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
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>
            <Footer />
            <FloatingButtons />
        </>
    );
};

export default NewsPage;
