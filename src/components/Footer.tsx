import React, { useState } from 'react';
import { Mail, MessageCircle, ArrowRight, Sparkles, Zap, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <footer className="py-20 bg-brand-dark-gradient border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Contact Section - Redesigned for Maximum Appeal */}
          <div className="text-center mb-16">
            {/* Eye-catching headline */}
            <div className="mb-12">
              <h3 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white mb-6">
                Ready to <span className="text-brand-orange">Partner</span> with Us?
              </h3>
              <p className="text-xl text-gray-300 font-body max-w-3xl mx-auto leading-relaxed">
                Transform your gaming portfolio with our innovative slot mechanics. 
                Let's create digital chaos together.
              </p>
            </div>

            {/* Redesigned Contact CTA - Much More Attractive */}
            <div className="relative group max-w-3xl mx-auto">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-orange rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              {/* Main container */}
              <div className="relative bg-gradient-to-br from-black/90 via-brand-dark/95 to-black/90 p-12 rounded-3xl border-2 border-brand-orange/40 backdrop-blur-sm hover:border-brand-orange/70 transition-all duration-500 hover:shadow-[0_0_60px_rgba(234,163,56,0.4)] transform hover:scale-[1.02]">
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 text-brand-orange/30">
                  <Sparkles size={24} />
                </div>
                <div className="absolute top-4 right-4 text-brand-orange/30">
                  <Zap size={24} />
                </div>
                <div className="absolute bottom-4 left-4 text-brand-orange/30">
                  <Zap size={24} />
                </div>
                <div className="absolute bottom-4 right-4 text-brand-orange/30">
                  <Sparkles size={24} />
                </div>

                <div className="flex flex-col items-center space-y-8">
                  {/* Enhanced Icon with animation */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-brand-gradient rounded-full flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                      <MessageCircle className="text-brand-dark" size={40} />
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 w-24 h-24 border-4 border-brand-orange/30 rounded-full animate-ping"></div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="text-center space-y-6">
                    <h4 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 tracking-wider">
                      LET'S BUILD THE FUTURE
                    </h4>
                    
                    <p className="text-lg text-gray-300 font-body max-w-lg mx-auto leading-relaxed">
                      Join forces with the pioneers of digital chaos. Your vision + Our innovation = Unstoppable gaming experiences.
                    </p>
                    
                    {/* Contact Info with enhanced styling */}
                    <div className="flex items-center justify-center space-x-3 mb-8">
                      <div className="w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center">
                        <Mail className="text-brand-orange" size={18} />
                      </div>
                      <a 
                        href="mailto:info@playeola.com"
                        className="text-xl font-semibold text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body tracking-wide"
                      >
                        info@playeola.com
                      </a>
                    </div>
                    
                    {/* Enhanced CTA Button */}
                    <button 
                      onClick={() => setIsContactModalOpen(true)}
                      className="group/btn relative overflow-hidden bg-gradient-to-r from-brand-orange to-brand-yellow text-brand-dark font-black uppercase tracking-widest py-5 px-12 rounded-2xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(234,163,56,0.8)] transform hover:-translate-y-1 text-lg"
                    >
                      {/* Button background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow to-brand-orange opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Button content */}
                      <div className="relative flex items-center space-x-4">
                        <span className="text-xl font-black">START PARTNERSHIP</span>
                        <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    </button>
                    
                    {/* Subtitle */}
                    <p className="text-sm text-gray-400 font-body italic">
                      Click to open partnership inquiry form
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Bottom Section - Better organized */}
          <div className="border-t border-gray-800 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center text-center lg:text-left">
              {/* Copyright - Left */}
              <div className="lg:col-span-1">
                <p className="text-sm text-gray-500 font-body">
                  © 2025 Play E Ola. All rights reserved.
                </p>
                <p className="text-xs text-gray-600 font-body mt-1">
                  Digital Chaos Engineered with ❤️
                </p>
              </div>

              {/* Legal Notice - Center */}
              <div className="lg:col-span-1">
                <p className="text-sm text-gray-400 font-body">
                  18+ Only. Please gamble responsibly.
                </p>
              </div>

              {/* Policy Links & Admin - Right */}
              <div className="lg:col-span-1">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-2 sm:space-y-0 sm:space-x-6">
                  <Link
                    to="/privacy-policy"
                    className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline font-body"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/cookies-policy"
                    className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline font-body"
                  >
                    Cookies Policy
                  </Link>
                  {/* Admin Button - Discreet but accessible */}
                  <Link
                    to="/admin/login"
                    className="group flex items-center space-x-1 text-xs text-gray-600 hover:text-brand-orange transition-colors duration-300 font-body"
                    title="Admin Access"
                  >
                    <Settings size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Admin</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Footer;