import React from "react";
import { Link } from "react-router";
import { Carousel, Row, Col } from "antd";
import { useBriefContent, useImgCarousel, useVaccineIntro } from "../../hooks/useDecorative";
import { VaccineCard } from "../Card/Card";

import "./Home.scss"

const Home: React.FC = () => {
  const { imgCarousel, loading, error } = useImgCarousel();
  const { briefContent } = useBriefContent();
  const {vaccineIntro} = useVaccineIntro();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const chunkSize = 8;
  const vaccineChunks = [];
  for (let i = 0; i < vaccineIntro.length; i += chunkSize) {
    vaccineChunks.push(vaccineIntro.slice(i, i + chunkSize));
  }

  return (
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
      <div className="briefContent">
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
      <div className="vaccineListContainer">
        <div className="titleHeader">
          <h2>Danh Mục Vaccine</h2>
          <span><Link to="#">Xem Tất Cả</Link></span>
        </div>
        <hr></hr>
        <div className="vaccineListIntro">
        <Carousel autoplay dots={false}>
          {vaccineChunks.map((chunk, index) => (
            <div key={index}>
              <Row gutter={[16, 16]}>
                {chunk.map((item) => (
                  <Col key={item.id} xs={12} sm={12} md={6} lg={6}>
                    <VaccineCard id={item.id} name={item.name} image={item.image} manufacturer={item.manufacturer} />
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
      </div>
    </div>
  );
};

export default Home;
