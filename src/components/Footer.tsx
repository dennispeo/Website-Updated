import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 bg-brand-dark-gradient border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Contact Section - Clean and Prominent */}
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

          {/* Single Prominent Contact CTA */}
          <div className="bg-gradient-to-r from-brand-orange/10 via-brand-yellow/10 to-brand-orange/10 p-10 rounded-3xl border border-brand-orange/30 backdrop-blur-sm max-w-2xl mx-auto hover:border-brand-orange/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,163,56,0.2)]">
            <div className="flex flex-col items-center space-y-6">
              {/* Icon */}
              <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center shadow-xl">
                <MessageCircle className="text-brand-dark" size={32} />
              </div>
              
              {/* Contact Info */}
              <div className="text-center">
                <h4 className="text-2xl font-heading font-bold text-white mb-3">
                  Get in Touch
                </h4>
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Mail className="text-brand-orange" size={20} />
                  <a 
                    href="mailto:info@playeola.com"
                    className="text-xl font-semibold text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
                  >
                    info@playeola.com
                  </a>
                </div>
                
                {/* CTA Button */}
                <button className="group bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-4 px-10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,163,56,0.6)] flex items-center space-x-3 font-body mx-auto">
                  <span className="text-lg">Start Partnership</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
            {/* Copyright */}
            <p className="text-sm text-gray-600 font-body">
              © 2025 Play E Ola. All rights reserved. Digital Chaos Engineered with ❤️
            </p>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 font-body">
              <span>
                18+ Only. Please gamble responsibly.{' '}
                <a
                  href="#"
                  className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline"
                >
                  Learn More
                </a>
              </span>
              <span>•</span>
              <Link
                to="/privacy-policy"
                className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/cookies-policy"
                className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline"
              >
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;