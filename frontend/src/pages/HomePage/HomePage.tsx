import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import {useImgCarousel, useBriefContent, useBlogIntro, useNewIntro} from "./useHomePage.ts";

import { useVaccineIntro } from "../../hooks/useVaccine";
import { useVaccineServiceIntro } from "./useHomePage.ts";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { ServiceCard, VaccineCard, NewsCard} from "../../components/Card/Card";

import Footer from "../../components/Footer/Footer.tsx"
import "./HomePage.scss"
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";


const HomePage : React.FC  = () => {

    const { imgCarousel } = useImgCarousel();
    const { briefContent } = useBriefContent();
    const { vaccineIntro } = useVaccineIntro();
    const { vaccineServiceIntro } = useVaccineServiceIntro();
    const { news } = useNewIntro();


    const {blogs : blogsIntro} = useBlogIntro()

    return(
        <>
        <CustomerNavbar/>
                <div className="homeContainer">
                    <div className="carouselContainer">
                        <Carousel autoplay>
                            {imgCarousel.map((item, index) => (
                                <img
                                    key={index}
                                    src={`../../../src/assets/homepage/${item.image}`}
                                    className="ImgSlider"
                                    alt="Introduction"
                                />
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
                                    <a href="/introduction">Xem Thêm</a>
                                </div>
                            </div>
                            <div className="briefContentImage">
                                <img
                                    src={`../../../src/assets/homepage/${item.image}`}
                                    alt={item.title}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{display: "flex", paddingLeft: "40px", paddingRight: "40px", width: "100%"}}>
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
                                <span><Link to="/news">Xem Tất Cả</Link></span>
                            </div>
                            <hr style={{borderColor: "black"}}></hr>
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
                                {news.map((newsItem) => (
                                    <Link
                                        key={newsItem.blogPostId}
                                        to={`/blog/${newsItem.blogPostId}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                       <NewsCard
                                           blogPostId={newsItem.blogPostId}
                                           title={newsItem.title}
                                           imageUrl={newsItem.imageUrl}
                                           type={newsItem.type}
                                       />
                                    </Link>
                                ))}
                            </Carousel>
                        </div>
                        <div className="newsListContainer">
                            <div className="titleHeader">
                                <h2>Blog</h2>
                                <span><Link to="/blog">Xem Tất Cả</Link></span>
                            </div>
                            <hr style={{borderColor: "black"}}/>
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
                                    <Link key={blog.blogPostId} to={`/blog/${blog.blogPostId}`}
                                          style={{textDecoration: "none"}}>
                                        <NewsCard
                                            blogPostId={blog.blogPostId}
                                            title={blog.title}
                                            imageUrl={blog.imageUrl}
                                            type={blog.type}
                                        />
                                    </Link>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>

            <FloatingButtons/>
            <Footer/>
        </>
    );
}


export default HomePage