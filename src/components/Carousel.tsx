"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const current = items[currentIndex];

  return (
    <div className="relative w-full mb-8">
      {/* Carousel Container with torn paper effect */}
      <div className="relative w-full h-80 md:h-96 lg:h-[500px]">
        {/* Slides */}
        <div className="relative w-full h-full overflow-hidden">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {item.title}
                </h2>
                <p className="text-lg md:text-2xl text-white drop-shadow-lg">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition md:p-3"
        >
          <ChevronLeft className="text-gray-800" size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition md:p-3"
        >
          <ChevronRight className="text-gray-800" size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
        
        {/* Torn Paper Effect at bottom of each slide - smooth wavy curves like fabric */}
        {/* Back Layer (subtle) */}
        <div className="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-28 pointer-events-none z-[15]">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,120
                 Q120,110 240,118
                 Q360,125 480,115
                 Q600,130 720,123
                 Q840,128 960,119
                 Q1080,126 1200,116
                 Q1320,112 1440,118
                 L1440,140 L0,140 Z"
              fill="#ffffff"
              className="opacity-90"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-28 pointer-events-none z-20">
          <svg 
            className="absolute bottom-0 w-full h-full" 
            viewBox="0 0 1440 140" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="carousel-paper-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                <feOffset dx="0" dy="-4" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Smooth wavy torn paper with pointed curves, deeper in the middle */}
            <path
              d="M0,124
                 Q110,114 220,120
                 Q330,128 440,118
                 Q550,132 660,125
                 Q770,130 880,121
                 Q990,129 1100,118
                 Q1210,115 1320,122
                 L1440,120
                 L1440,140 L0,140 Z"
              fill="#f8fafc"
              filter="url(#carousel-paper-shadow)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};