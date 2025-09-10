import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const ImageCarousel: React.FC = () => {
  const images = [
    "/download.jpg", "/trade.jpg", "/download.jpg", "/download1.jpg", 
    "/download2.jpg", "/download3.jpg", "/download4.jpg", "/download5.jpg", 
    "/download6.jpg", "/download7.jpg", "/download8.jpg", "/download9.jpg", 
    "/download10.jpg", "/download11.jpg", "/download12.jpg", "/download13.jpg", 
    "/download14.jpg", "/download15.jpg", "/download16.jpg", "/download17.jpg", "/download18.jpg", "/download19.jpg", "/download21.jpg", 
    "/download22.jpg", "/download23.jpg", "/download24.jpg", "/download25.jpg", "/download26.jpg"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Add image descriptions (you can customize these)
  const imageDescriptions = [
    "Students trading on campus",
    "Campus marketplace in action",
    "Student exchange event",
    // Add more descriptions as needed
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const goToNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 200);
  };

  const goToPrevious = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 200);
  };

  const goToImage = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 200);
  };

  return (
    <div className="carousel-container">
      <div 
        className="carousel-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <img
          src={images[currentIndex]}
          alt="Campus trading scene"
          className={`carousel-image ${fade ? "fade-in" : "fade-out"}`}
          loading="lazy"
        />
        
        {/* Navigation Arrows */}
        <button className="carousel-arrow carousel-arrow-left" onClick={goToPrevious}>
          &#8249;
        </button>
        <button className="carousel-arrow carousel-arrow-right" onClick={goToNext}>
          &#8250;
        </button>
        
        {/* Image Indicator Dots */}
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToImage(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Image Counter */}
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Optional: Add image caption if you have descriptions */}
        {imageDescriptions[currentIndex] && (
          <div className="image-caption">
            {imageDescriptions[currentIndex]}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;