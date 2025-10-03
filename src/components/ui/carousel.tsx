'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ['/Speaker1.png', '/Speaker2.png', '/Speaker3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8">
      <div className="overflow-hidden rounded-lg shadow-lg">
                  <div
                    className="flex transition-transform duration-500 ease-in-out max-h-96"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {images.map((src, index) => (
                      <Image key={index} src={src} alt={`Carousel image ${index + 1}`} className="w-full flex-shrink-0 object-contain" />
                    ))}
                  </div>      </div>
    </div>
  );
};

export default Carousel;
