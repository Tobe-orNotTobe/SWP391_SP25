import React from "react";
import styles from "./Home.module.css";
import { Carousel } from "antd";
import { useBriefContent, useImgCarousel } from "../../hooks/useDecorative";

const Home: React.FC = () => {
  const {imgCarousel, loading, error} = useImgCarousel();
  const {briefContent} = useBriefContent();
      if (loading) {
          return <p>Loading...</p>;  
      }
      
      if (error) {
          return <p>Error: {error}</p>;  
      }
  

  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.carouselContainer}>
          <Carousel autoplay>
              {imgCarousel.map((item, index) => (
                <img
                  key={index}
                  src={`../../../src/assets/homepage/${item.image}`}
                  className={styles.ImgSlider}
                  alt="Introduction" 
                  />
              ))}
          </Carousel>
          </div>
          <div className={styles.briefContent}>
            {briefContent.map((item, index) =>(
              <div key={index} className={styles.content}>
                <div className={styles.text}>
                  <h1>{item.title}</h1>
                  <p>{item.paragraph1}</p>
                  <p>{item.paragraph2}</p>
                  <div className={styles.fullContent}>
                    <a href="#">Xem Thêm</a>
                  </div>
                </div>
                <div className={styles.image}>
                  <img src={`../../../src/assets/homepage/${item.image}`} alt={item.title} />
                </div>
              </div>
            ))}
              <div></div>
          </div>
      </div>
      
    </>
  );
};

export default Home;
