import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Home.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; //imports bootstrap


const HomePage: React.FC = () => { //Carousel for homepage to make it more dynamic
  return (
    <div>
      <div
        id="carouselImages"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="3000" 
        data-bs-pause="false" 
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div
              className="background-slide"
              style={{ backgroundImage: 'url(/images-carousel/picture1.jpg)' }}
            ></div>
          </div>
          <div className="carousel-item">
            <div
              className="background-slide"
              style={{ backgroundImage: 'url(/images-carousel/picture2.jpg)' }}
            ></div>
          </div>
          <div className="carousel-item">
            <div
              className="background-slide"
              style={{ backgroundImage: 'url(/images-carousel/picture3.jpg)' }}
            ></div>
          </div>
          <div className="carousel-item">
            <div
              className="background-slide"
              style={{ backgroundImage: 'url(/images-carousel/picture4.jpg)' }}
            ></div>
          </div>
          <div className="carousel-item">
            <div
              className="background-slide"
              style={{ backgroundImage: 'url(/images-carousel/picture5.jpg)' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="foreground-content">
        <h1>Welcome to Nest!</h1>
        <p>Share your life in pictures and notes with friends & family.</p>
      </div>
    </div>
  );
};

export default HomePage;
