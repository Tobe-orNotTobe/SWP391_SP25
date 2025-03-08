import React, {useEffect} from "react"
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetBlogDetailById} from "../../hooks/useBlog.ts";
import {useParams} from "react-router-dom";
import "./Blog.scss"

const BlogDetailPage :React.FC = () => {

    const { blog, loading, error, fetchBlogDetail} = useGetBlogDetailById();
    const { id } = useParams();

    useEffect(() => {
        fetchBlogDetail(Number(id)).then();
    }, []);

    return (
        <>
            <CustomerNavbar/>
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
            <Footer/>
            <FloatingButtons/>
        </>
    );
}

export default BlogDetailPage;