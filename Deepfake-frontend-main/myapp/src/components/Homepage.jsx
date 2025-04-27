import React from 'react';
import HomeHeader from './Home-header';
import Slider from 'react-slick';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import '../Styles/Home.css';
import '../Styles/Home-header.css';

const HomePage = ({ handleOrderPopup }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="home-container">
      <HomeHeader />
      <main className="main-content">
        <Slider {...settings}>
          <div>
            <h1 data-aos="zoom-out" data-aos-duration="500" data-aos-once="true" className="hero-title">
              AI Interface Visualization
            </h1>
            <div className="image-grid">
              <div className="grid-item large-left" data-aos="fade-up" data-aos-duration="500">
                <img src="/image/ai-face.jpg" alt="AI Interface visualization with data elements" className="grid-image" />
              </div>
              <div className="grid-item large-right" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
                <img src="/image/deepfake-tech.jpg" alt="Deepfake detection interface" className="grid-image" />
              </div>
              <div className="grid-item small-left" data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">
                <img src="/image/face-mesh.jpg" alt="Wireframe face model patterns" className="grid-image" />
              </div>
              <div className="grid-item small-right-wrapper" data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
                <div className="small-right-back">
                  <img src="/image/face-scan-2.jpg" alt="3D wireframe face model" className="grid-image" />
                </div>
                <div className="small-right-front">
                  <img src="/image/face-scan-1.jpg" alt="Wireframe face profile" className="grid-image" />
                </div>
              </div>
              <div className="grid-item description-box" data-aos="fade-up" data-aos-duration="500" data-aos-delay="400">
                <div className="description-text">
                  <p>
                    DeepShield project develops a deepfake detection system using pretrained models and cosine similarity to
                    identify manipulated media content. The methodology involves feature extraction and similarity calculation to
                    classify media samples. The system demonstrates high accuracy and reliability in detecting deepfakes,
                    ensuring digital content integrity.
                  </p>
                </div>
              </div>
              <div className="grid-item ai-intelligence" data-aos="fade-up" data-aos-duration="500" data-aos-delay="500">
                <img src="/image/ai_intelligence.jpg" alt="Artificial Intelligence concept visualization" className="grid-image" />
              </div>
            </div>
          </div>
        </Slider>
      </main>
    </div>
  );
};

export default HomePage;
