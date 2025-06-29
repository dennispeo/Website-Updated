import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-start bg-brand-dark-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,163,56,0.1)_0%,transparent_50%)]"></div>
      </div>

      {/* Video Container */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source 
            src="https://www-live.hacksawgaming.com/teaser_videos/1_Videowebsite-OPTIMIZED-LANDSCAPE_16_8_1920x1080.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Below Video */}
      <div className="text-center px-4 max-w-4xl mx-auto py-16">
        {/* Welcome Text */}
        <div className="mb-6">
          <p className={`text-sm font-bold uppercase tracking-[0.75em] text-gray-400 transition-all duration-1000 font-body ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Welcome To
          </p>
        </div>

        {/* Main Headline */}
        <h1 className={`text-6xl md:text-8xl font-heading font-black uppercase mb-8 transition-all duration-600 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Digital
          </span>
          <br />
          <span className="text-white">Chaos</span>
        </h1>

        {/* Sub-copy */}
        <div className={`mb-12 transition-all duration-800 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-body">
            Digital Chaos is our product philosophy.<br />
            It's how we build tension, trigger emotion, and make every spin feel like it matters.
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-1000 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button className="cta-button group relative px-8 py-4 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,163,56,0.5)] font-body">
            <span className="relative z-10">See Our Portfolio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow to-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;