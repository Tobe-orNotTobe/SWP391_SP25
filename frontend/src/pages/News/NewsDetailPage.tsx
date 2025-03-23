import React, {useEffect, useState} from "react"
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetAllBlog, useGetNewsDetailById, useRandomBlogs} from "../../hooks/useBlog.ts";
import {useParams} from "react-router-dom";
import "./News.scss"
import {NewsResponse} from "../../interfaces/Blog.ts";
import NewsPost from "../../components/News/NewsPost.tsx";

const NewsDetailPage :React.FC = () => {

    const { newsDetail, loading, error, fetchNewsDetail} = useGetNewsDetailById();
    const { id } = useParams();
    const {handleGetRandomNews} = useRandomBlogs();
    const [randomNews, setRandomNews] = useState<NewsResponse[]>([]);
    const { news, fetchAllBlog} = useGetAllBlog();

    useEffect(() => {
        if (!id) return;
        fetchAllBlog(true, "news").then();
        fetchNewsDetail(Number(id));
    }, [id]);

    useEffect(() => {
        const fiveNews = handleGetRandomNews(5, news);
        console.log("Blogs received from handleGetRandomBlogs:", news);

        const filteredNews = fiveNews.filter((b) => b.blogPostId !== Number(id));
        setRandomNews(filteredNews.slice(0, 3));
    }, [news]);

    useEffect(() => {
        const handleScroll = () => {
            const sidebar = document.getElementById("random-blogs-container");
            const footer = document.getElementById("footer");
            if (!sidebar || !footer) return;

            const sidebarHeight = sidebar.offsetHeight;
            const footerOffsetTop = footer.offsetTop;
            const windowBottom = window.scrollY + window.innerHeight;
            const stopPosition = footerOffsetTop - 600; // Khi còn cách footer 600px

            if (window.scrollY >= 980 && windowBottom < stopPosition) {
                sidebar.style.position = "fixed";
                sidebar.style.top = "10px";
                sidebar.style.right = "1%";
                sidebar.style.paddingTop = "20px";
            } else if (windowBottom >= stopPosition) {
                sidebar.style.position = "absolute";
                sidebar.style.top = stopPosition - sidebarHeight + 600 + "px"; // Dừng lại cách footer 600px
                sidebar.style.right = "1%";
            } else {
                sidebar.style.position = "static";
                sidebar.style.paddingTop = "920px";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <>
            <CustomerNavbar/>

            <div style={{display: "flex"}}>

                <div style={{width: '20%'}}>

                </div>

                <div className={"blog-detail-container"}>
                    {loading && ("Loading...")}
                    {error && ("Error")}
                    {newsDetail && (
                        <div className={"blog-detail-content"}>
                            <img src={newsDetail.imageUrl} alt={newsDetail.title} className="blog-image"/>
                            <div className={"blog-text"} dangerouslySetInnerHTML={{__html: newsDetail.content}}></div>

                        </div>
                    )}

                </div>

                <div style={{width: '20%'}}>
                    <div
                        id="random-blogs-container"
                        style={{display: "grid", justifyContent: "center"}}
                    >
                        {randomNews && (
                            randomNews.map(randomNew => (
                                <NewsPost key={randomNew.blogPostId} news={randomNew}/>
                            ))
                        )}
                    </div>
                </div>

            </div>

            <Footer/>
            <FloatingButtons/>
        </>
    );
}

export default NewsDetailPage;