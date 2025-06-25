import React, { useEffect, useState } from 'react';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShoppingHome = () => {
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      {/* Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow hover:bg-white transition z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow hover:bg-white transition z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ShoppingHome;
