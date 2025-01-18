import React from "react";
import { Carousel } from "antd";
import "./Home.scss"
import { useBriefContent, useImgCarousel } from "../../hooks/useDecorative";

const Home: React.FC = () => {
  const { imgCarousel, loading, error } = useImgCarousel();
  const { briefContent } = useBriefContent();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
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
                <a href="#">Xem Thêm</a>
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
        <div></div>
      </div>
    </div>
  );
};

export default Home;
