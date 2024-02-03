import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  const slides = [
    {
      imageUrl: "PythonHUDSystem.png",
      subtitle: 'This is a python sysm',
    },
    {
      imageUrl: 'image2.jpg',
      subtitle: 'Subtitle 2',
    },
    {
      imageUrl: 'image3.jpg',
      subtitle: 'Subtitle 3',
    },
  ];

  return (
    <div>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <img src={slide.imageUrl} alt={`Slide ${index}`} />
            <p>{slide.subtitle}</p>
          </div>
        ))}
      </Slider>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Current Slide: {currentSlide + 1}</p>
      </div>
    </div>
  );
};

export default ImageCarousel;