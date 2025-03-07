import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { useImgCarousel, useBriefContent, useNewsIntro, useVaccineServiceIntro } from "./useHomePage.ts";
import { useVaccineIntro } from "../../hooks/useVaccine";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { ServiceCard, VaccineCard, NewsCard } from "../../components/Card/Card";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import "./HomePage.scss";

const HomePage: React.FC = () => {
    const { imgCarousel } = useImgCarousel();
    const { briefContent } = useBriefContent();
    const { vaccineIntro } = useVaccineIntro();
    const { vaccineServiceIntro } = useVaccineServiceIntro();
    const { newsIntro } = useNewsIntro();

    return (
        <>
            <CustomerNavbar />
            <div className="homeContainer">
                {/* Carousel Hình ảnh */}
                <div className="carouselContainer">
                    <Carousel autoplay>
                        {imgCarousel.map((item, index) => (
                            <img key={index} src={`../../../src/assets/homepage/${item.image}`} className="ImgSlider" alt="Introduction" />
                        ))}
                    </Carousel>
                </div>

                {/* Nội dung giới thiệu */}
                <div className="briefContent">
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

                {/* Danh mục Vaccine */}
                <div className="vaccineListContainer">
                    <div className="titleHeader">
                        <h2>Danh Mục Vaccine</h2>
                        <span><Link to="/vaccines-list">Xem Tất Cả</Link></span>
                    </div>
                    <hr/>
                    <Carousel autoplay dots={false}>
                        {vaccineIntro.map((item) => (
                            <Link key={item.id} to={`/vaccines-list/${item.id}`} style={{textDecoration: "none"}}>
                                <VaccineCard id={item.id} name={item.name} image={item.image}
                                             manufacturer={item.manufacturer}/>
                            </Link>
                        ))}
                    </Carousel>
                </div>

                {/* Dịch vụ tiêm chủng */}
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
                            <ServiceCard key={service.id} id={service.id} name={service.name} image={service.image}/>
                        ))}
                    </Carousel>
                </div>

                {/* Tin tức */}
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
            </div>
            <FloatingButtons />
            <Footer />
        </>
    );
};

export default HomePage;
