import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { useImgCarousel, useBriefContent} from "./useHomePage.ts";
import { useNewsIntro } from "./useHomePage.ts";
import { useVaccineIntro } from "../../hooks/useVaccine";
import { useVaccineServiceIntro } from "./useHomePage.ts";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { ServiceCard, VaccineCard, NewsCard} from "../../components/Card/Card";
import {Row, Col} from "antd";
import Footer from "../../components/Footer/Footer.tsx"
import "./HomePage.scss"
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useGetAllBlog} from "../../hooks/useBlog.ts";
import BlogPost from "../../components/Blog/BlogPost.tsx";


const HomePage : React.FC  = () => {

    const { imgCarousel, loading, error } = useImgCarousel();
    const { briefContent, loading : briefContentLoading, error : briefContentError } = useBriefContent();
    const {vaccineIntro, loading: vaccineIntroLoading, error: vaccineIntroError} = useVaccineIntro();
    const {vaccineServiceIntro, loading: vaccineServiceIntroLoading, error: vaccineServiceError} = useVaccineServiceIntro();
    const {newsIntro, loading: blogIntroLoading, error : blogIntroError} = useNewsIntro();
    const { blogs, fetchAllBlog} = useGetAllBlog()
    const firstBlog = blogs.length > 0 ? blogs[0] : null;
    const secondBlog = blogs.length > 1 ? blogs[1] : null;
    const thirdBlog = blogs.length > 2 ? blogs[2] : null;
    const fourBlog = blogs.length > 3 ? blogs[3] : null;


    useEffect(() => {
        fetchAllBlog(true);
    }, []);

    if (loading || briefContentLoading || vaccineIntroLoading || vaccineServiceIntroLoading || blogIntroLoading) {
        return <p>Loading...</p>;
    }

    if (error || briefContentError || vaccineIntroError || vaccineServiceError || blogIntroError) {
        return <p>Error: {error}</p>;
    }


    const chunkSize = 8;
    const vaccineChunks = [];
    for (let i = 0; i < vaccineIntro.length; i += chunkSize) {
        vaccineChunks.push(vaccineIntro.slice(i, i + chunkSize));
    }

    const newsChunkSize = 3;
    const newsChunks = [];
    for (let i = 0; i < newsIntro.length; i += newsChunkSize) {
        newsChunks.push(newsIntro.slice(i, i + newsChunkSize));
    }

    return(
        <>
        <CustomerNavbar/>
            <div>
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
                            <hr></hr>
                            <div className="vaccineListIntro">
                                <Carousel autoplay dots={false}>
                                    {vaccineChunks.map((chunk, index) => (
                                        <div key={index}>
                                            <Row gutter={[16, 16]}>
                                                {chunk.map((item) => (
                                                    <Col key={item.id} xs={12} sm={12} md={6} lg={6}>
                                                        <Link to={`/vaccines-list/${item.id}`}
                                                              style={{textDecoration: "none"}}>
                                                            <VaccineCard
                                                                id={item.id}
                                                                name={item.name}
                                                                image={item.image}
                                                                manufacturer={item.manufacturer}
                                                            />
                                                        </Link>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                        <div className="serviceListContainer">
                            <div className="titleHeader">
                                <h2>Dịch Vụ Tiêm Chủng</h2>
                            </div>
                            <hr></hr>
                            <div className="vaccineServiceIntro">
                                <Row gutter={[16, 16]}>
                                    {vaccineServiceIntro.slice(0, 4).map((service) => (
                                        <Col key={service.id} xs={12} sm={12} md={6} lg={6}>
                                            <ServiceCard id={service.id} name={service.name} image={service.image}/>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>
                        <div className="newsListContainer">
                            <div className="titleHeader">
                                <h2>Tin Tức</h2>
                            </div>
                            <hr></hr>
                            <div className="newsIntro">
                                <Carousel autoplay dots={false}>
                                    {newsChunks.map((chunk, index) => (
                                        <div key={index}>
                                            <Row gutter={[16, 16]}>
                                                {chunk.map((news) => (
                                                    <Col key={news.id} xs={24} sm={12} md={8} lg={8}>
                                                        <NewsCard id={news.id} title={news.title} image={news.image}
                                                                  briefContent={news.briefContent}/>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
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