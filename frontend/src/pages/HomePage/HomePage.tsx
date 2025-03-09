import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import {useImgCarousel, useBriefContent, useBlogIntro} from "./useHomePage.ts";
import { useNewsIntro } from "./useHomePage.ts";
import { useVaccineIntro } from "../../hooks/useVaccine";
import { useVaccineServiceIntro } from "./useHomePage.ts";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { ServiceCard, VaccineCard, NewsCard} from "../../components/Card/Card";

import Footer from "../../components/Footer/Footer.tsx"
import "./HomePage.scss"
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetAllBlog} from "../../hooks/useBlog.ts";
import BlogPost from "../../components/Blog/BlogPost.tsx";


const HomePage : React.FC  = () => {

    const { imgCarousel } = useImgCarousel();
    const { briefContent } = useBriefContent();
    const { vaccineIntro } = useVaccineIntro();
    const { vaccineServiceIntro } = useVaccineServiceIntro();
    const { newsIntro } = useNewsIntro();
    const { blogs, fetchAllBlog} = useGetAllBlog();
    const {blogs : blogsIntro} = useBlogIntro()

    console.log(blogsIntro)
    const firstBlog = blogs.length > 0 ? blogs[0] : null;
    const secondBlog = blogs.length > 1 ? blogs[1] : null;
    const thirdBlog = blogs.length > 2 ? blogs[2] : null;
    const fourBlog = blogs.length > 3 ? blogs[3] : null;


    useEffect(() => {
        fetchAllBlog(true);
    }, []);

    return(
        <>
            <CustomerNavbar/>
            <div>
                <div className="homeContainer">
                    <div className="carouselContainer">
                        <Carousel autoplay>
                            {imgCarousel.map((item, index) => (
                                <img key={index} src={`../../../src/assets/homepage/${item.image}`} className="ImgSlider" alt="Introduction" />
                            ))}
                        </Carousel>
                    </div>
                </div>

                <div className="briefContent" style={{paddingRight:'300px', paddingLeft: "300px"}}>
                    {briefContent.map((item, index) => (
                        <div key={index} className="briefSmallContent">
                            <div className="briefContentText">
                                <h1>{item.title}</h1>
                                <p>{item.paragraph1}</p>
                                <p>{item.paragraph2}</p>
                                <div className="briefFullContent">
                                    <Link to="/introduction">Xem Thêm</Link>
                                </div>
                            </div>
                            <div className="briefContentImage">
                                <img src={`../../../src/assets/homepage/${item.image}`} alt={item.title} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{display: "flex", paddingLeft: "40px", paddingRight: "40px", width: "100%"}}>
                    <div>
                        <BlogPost key={firstBlog?.blogPostId} blog={firstBlog}/>
                        <BlogPost key={thirdBlog?.blogPostId} blog={thirdBlog}/>
                    </div>
                    <div className="homeContainer">
                        <div className="vaccineListContainer">
                            <div className="titleHeader">
                                <h2>Danh Mục Vaccine</h2>
                                <span><Link to="/vaccines-list">Xem Tất Cả</Link></span>
                            </div>
                            <hr/>
                            <Carousel
                                autoplay
                                dots={false}
                                slidesToShow={4}
                                slidesToScroll={2}
                                responsive={[
                                    {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 1}},
                                    {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 1}},
                                    {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}}
                                ]}
                            >
                                {vaccineIntro.map((item) => (
                                    <Link key={item.id} to={`/vaccines-list/${item.id}`}
                                          style={{textDecoration: "none"}}>
                                        <VaccineCard id={item.id} name={item.name} image={item.image}
                                                     manufacturer={item.manufacturer}/>
                                    </Link>
                                ))}
                            </Carousel>
                        </div>
                        <div className="serviceListContainer">
                            <div className="titleHeader">
                                <h2>Dịch Vụ Tiêm Chủng</h2>
                            </div>
                            <hr/>
                            <Carousel
                                autoplay
                                dots={false}
                                slidesToShow={4}
                                slidesToScroll={1}
                                responsive={[
                                    {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 1}},
                                    {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 1}},
                                    {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}}
                                ]}
                            >
                                {vaccineServiceIntro.map((service) => (
                                    <ServiceCard key={service.id} id={service.id} name={service.name}
                                                 image={service.image}/>
                                ))}
                            </Carousel>
                        </div>
                        <div className="newsListContainer">
                            <div className="titleHeader">
                                <h2>Tin Tức</h2>
                            </div>
                            <hr/>
                            <Carousel
                                autoplay
                                dots={false}
                                slidesToShow={3}
                                slidesToScroll={1}
                                responsive={[
                                    {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 1}},
                                    {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 1}},
                                    {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}}
                                ]}
                            >
                                {newsIntro.map((news) => (
                                    <NewsCard key={news.id} id={news.id} title={news.title} image={news.image}
                                              briefContent={news.briefContent}/>
                                ))}
                            </Carousel>
                        </div>
                        <div className="newsListContainer">
                            <div className="titleHeader">
                                <h2>Blog</h2>
                                <span><Link to="/blogs">Xem Tất Cả</Link></span>
                            </div>
                            <hr/>
                            <Carousel
                                autoplay
                                dots={false}
                                slidesToShow={3}
                                slidesToScroll={1}
                                responsive={[
                                    {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 1}},
                                    {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 1}},
                                    {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}}
                                ]}
                            >
                                {blogsIntro.map((blog) => (
                                    <Link key={blog.blogPostId} to={`/blogs/${blog.blogPostId}`} style={{textDecoration: "none"}}>
                                        <NewsCard
                                            id={blog.blogPostId}
                                            title={blog.title}
                                            image={blog.imageUrl}
                                            briefContent=""
                                        />
                                    </Link>
                                ))}
                            </Carousel>
                        </div>
                    </div>

                    <div>
                        <BlogPost key={secondBlog?.blogPostId} blog={secondBlog}/>
                        <BlogPost key={fourBlog?.blogPostId} blog={fourBlog}/>
                    </div>
                </div>


            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}


export default HomePage