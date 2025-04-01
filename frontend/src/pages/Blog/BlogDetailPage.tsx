import React, {useEffect, useState} from "react"
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetAllBlog, useGetBlogDetailById, useRandomBlogs} from "../../hooks/useBlog.ts";
import {useParams} from "react-router-dom";
import "./Blog.scss"
import BlogPost from "../../components/Blog/BlogPost.tsx";
import {BlogResponse} from "../../interfaces/Blog.ts";

const BlogDetailPage :React.FC = () => {

    const { blog, loading, error, fetchBlogDetail} = useGetBlogDetailById();
    const { id } = useParams();
    const {handleGetRandomBlogs} = useRandomBlogs();
    const [randomBlogs, setRandomBlogs] = useState<BlogResponse[]>([]);
    const { blogs, fetchAllBlog} = useGetAllBlog();

    useEffect(() => {
        if (!id) return;
        fetchAllBlog(true, "blog").then();
        fetchBlogDetail(Number(id));
    }, [id]);

    useEffect(() => {
        const fiveBlogs = handleGetRandomBlogs(5, blogs);
        console.log("Blogs received from handleGetRandomBlogs:", blogs); // Kiểm tra

        const filteredBlogs = fiveBlogs.filter((b) => b.blogPostId !== Number(id));
        setRandomBlogs(filteredBlogs.slice(0, 3));
    }, [blogs]); // Chạy sau khi blog chính được tải xong

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
                    {blog && (
                        <div className={"blog-detail-content"}>
                            <img src={blog.imageUrl} alt={blog.title} className="blog-image"/>
                            <div className={"blog-text"} dangerouslySetInnerHTML={{__html: blog.content}}></div>

                        </div>
                    )}

                </div>

                <div style={{width: '20%'}}>
                    <div
                        id="random-blogs-container"
                        style={{display: "grid", justifyContent: "center"}}
                    >
                        {randomBlogs && (
                            randomBlogs.map(randomBlog => (
                                <BlogPost key={randomBlog.blogPostId} blog={randomBlog}/>
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

export default BlogDetailPage;