import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";

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
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isHovering]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const current = items[currentIndex];

  return (
    <div
      className="relative w-full mb-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-3xl overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 grid-background opacity-10 z-0"></div>

        {/* Slides with 3D Transform */}
        <div className="relative w-full h-full">
          {items.map((item, index) => {
            const offset = (index - currentIndex + items.length) % items.length;
            const isActive = offset === 0;
            const isPrev = offset === items.length - 1;
            const isNext = offset === 1;

            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${isActive
                    ? "opacity-100 z-20 scale-100"
                    : isPrev
                      ? "opacity-30 z-10 scale-95 -translate-x-full"
                      : isNext
                        ? "opacity-30 z-10 scale-95 translate-x-full"
                        : "opacity-0 z-0 scale-90"
                  }`}
                style={{
                  transform: isActive
                    ? "perspective(1000px) rotateY(0deg)"
                    : isPrev
                      ? "perspective(1000px) rotateY(20deg)"
                      : isNext
                        ? "perspective(1000px) rotateY(-20deg)"
                        : "perspective(1000px) rotateY(0deg)"
                }}
              >
                {/* Image with Parallax Effect */}
                <div className="relative w-full h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? "scale-105" : "scale-100"
                      }`}
                  />

                  {/* Gradient Overlay with Animation */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-60 mix-blend-multiply transition-opacity duration-700`}></div>

                  {/* Radial Glow Effect */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30"></div>
                </div>

                {/* Content with Slide Animation */}
                <div className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 lg:p-24 transition-all duration-700 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}>
                  {/* Glowing Background Card */}
                  <div className="glass rounded-3xl p-8 md:p-10 max-w-2xl transform hover:scale-105 transition-transform duration-300">
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      {/* Title with Gradient Text */}
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 animate-slide-up">
                        <span className="gradient-text">{item.title}</span>
                      </h2>

                      {/* Subtitle with Fade In */}
                      <p className="text-xl md:text-3xl font-semibold text-slate-700 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        {item.subtitle}
                      </p>

                      {/* Decorative Line */}
                      <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-slide-up" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons with Futuristic Design */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 glass rounded-2xl hover-glow transition-all duration-300 transform hover:scale-110 hover:-translate-x-2 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 glass rounded-2xl hover-glow transition-all duration-300 transform hover:scale-110 hover:translate-x-2 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Futuristic Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-full blur-md transition-all duration-300 ${index === currentIndex
                  ? "bg-blue-500 scale-150 opacity-50"
                  : "bg-slate-300 scale-100 opacity-0"
                }`}></div>

              {/* Indicator */}
              <div className={`relative w-3 h-3 rounded-full transition-all duration-500 ${index === currentIndex
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-125"
                  : "bg-white/50 scale-100 group-hover:bg-white/80 group-hover:scale-110"
                }`}>
                {index === currentIndex && (
                  <div className="absolute inset-0 rounded-full bg-white/50 animate-ping"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/20 z-30">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-linear"
            style={{
              width: `${((currentIndex + 1) / items.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Floating Particles Effect (Optional) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};