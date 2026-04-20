import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      imageUrl: "/PythonHUDSystem.png",
      subtitle: "This is a python sysm",
    },
    {
      imageUrl: "/PythonHUDFigma.png",
      subtitle: "Subtitle 2",
    },
    {
      imageUrl: "/LOAS_Figma.png",
      subtitle: "Subtitle 3",
    },
  ];

  return (
    <div>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
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
