import React, { useState } from 'react';
import { Mail, MessageCircle, ArrowRight, Zap, Target, Trophy, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <footer className="py-20 bg-brand-dark-gradient border-t border-gray-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-brand-orange rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-brand-yellow rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brand-orange/20 rounded-lg rotate-12 animate-pulse"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-brand-yellow/30 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Gamified Contact Section */}
          <div className="text-center mb-16">
            {/* Power-Up Style Header */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 bg-brand-gradient px-6 py-2 rounded-full mb-6 shadow-lg">
                <Trophy className="text-brand-dark" size={20} />
                <span className="text-brand-dark font-bold uppercase tracking-wider font-body text-sm">Level Up Your Portfolio</span>
              </div>
              
              <h3 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white mb-6">
                Ready to <span className="text-brand-orange">Join Forces</span>?
              </h3>
              <p className="text-xl text-gray-300 font-body max-w-3xl mx-auto leading-relaxed">
                Unlock exclusive game mechanics and transform your platform with our innovative slot technology. 
                <span className="text-brand-orange font-semibold"> The next level awaits.</span>
              </p>
            </div>

            {/* Game-Style Contact Card */}
            <div className="relative max-w-3xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-brand-gradient opacity-20 rounded-3xl blur-xl"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-black/80 via-black/60 to-black/80 p-10 rounded-3xl border-2 border-brand-orange/50 backdrop-blur-sm hover:border-brand-orange transition-all duration-500 hover:shadow-[0_0_60px_rgba(234,163,56,0.4)] group">
                {/* Achievement Badge Style Header */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-brand-gradient rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Gamepad2 className="text-brand-dark" size={36} />
                    </div>
                    {/* Floating Icons */}
                    <Zap className="absolute -top-2 -right-2 text-brand-yellow animate-pulse" size={16} />
                    <Target className="absolute -bottom-2 -left-2 text-brand-orange animate-bounce" size={16} />
                  </div>
                </div>
                
                {/* Contact Info with Game UI Style */}
                <div className="text-center mb-8">
                  <h4 className="text-3xl font-heading font-bold text-white mb-4 group-hover:text-brand-orange transition-colors duration-300">
                    Initiate Partnership Protocol
                  </h4>
                  
                  {/* Email with Game UI Styling */}
                  <div className="bg-black/60 border border-gray-600 rounded-xl p-4 mb-6 hover:border-brand-orange/50 transition-all duration-300">
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="text-brand-orange" size={20} />
                      <a 
                        href="mailto:info@playeola.com"
                        className="text-xl font-semibold text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
                      >
                        info@playeola.com
                      </a>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 font-body">Direct Line to Game Masters</div>
                  </div>
                  
                  {/* Power-Up Style CTA Button */}
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="group/btn relative bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-5 px-12 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(234,163,56,0.8)] flex items-center space-x-4 font-body mx-auto text-lg overflow-hidden"
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-yellow opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    
                    {/* Button Content */}
                    <div className="relative z-10 flex items-center space-x-3">
                      <MessageCircle size={24} className="group-hover/btn:animate-pulse" />
                      <span>Launch Partnership Quest</span>
                      <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </div>
                    
                    {/* Sparkle Effects */}
                    <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 animate-ping"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 animate-ping delay-150"></div>
                  </button>
                  
                  {/* Achievement Style Subtitle */}
                  <div className="mt-4 text-sm text-gray-400 font-body">
                    🏆 <span className="text-brand-orange">Achievement Unlocked:</span> Partnership Initiated
                  </div>
                </div>

                {/* Game Stats Style Info */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-orange font-heading">24h</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-body">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-orange font-heading">100%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-body">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-orange font-heading">∞</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-body">Possibilities</div>
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
                <a
                  href="#"
                  className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline font-body"
                >
                  Learn More About Responsible Gaming
                </a>
              </div>

              {/* Policy Links - Right */}
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