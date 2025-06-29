import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 bg-brand-dark-gradient border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Contact Section - Much More Prominent */}
        <div className="text-center mb-16">
          {/* Eye-catching headline */}
          <div className="mb-8">
            <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-wider text-white mb-4">
              Ready to <span className="text-brand-orange">Partner</span> with Us?
            </h3>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 font-body max-w-3xl mx-auto leading-relaxed">
              Transform your gaming portfolio with our innovative slot mechanics. 
              Let's create digital chaos together.
            </p>
          </div>

          {/* Prominent Contact CTA */}
          <div className="bg-gradient-to-r from-brand-orange/20 via-brand-yellow/20 to-brand-orange/20 p-8 rounded-2xl border-2 border-brand-orange/30 backdrop-blur-sm mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left side - Contact info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="text-brand-dark" size={28} />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-heading font-bold text-white mb-1">
                    Get in Touch
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-brand-orange" size={20} />
                    <a 
                      href="mailto:info@playeola.com"
                      className="text-xl font-semibold text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
                    >
                      info@playeola.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Right side - CTA Button */}
              <button className="group bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,163,56,0.6)] flex items-center space-x-3 font-body">
                <span className="text-lg">Start Partnership</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Secondary contact options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1">
              <h4 className="text-lg font-heading font-bold text-brand-orange mb-2">Business Inquiries</h4>
              <p className="text-gray-300 text-sm font-body">Partnership opportunities and licensing</p>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1">
              <h4 className="text-lg font-heading font-bold text-brand-orange mb-2">Technical Support</h4>
              <p className="text-gray-300 text-sm font-body">Integration and development assistance</p>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1">
              <h4 className="text-lg font-heading font-bold text-brand-orange mb-2">Media & Press</h4>
              <p className="text-gray-300 text-sm font-body">Press releases and media kits</p>
            </div>
          </div>
        </div>

        {/* Merged Bottom Section - Single unified area */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Left side - Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 font-body">
                © 2025 Play E Ola. All rights reserved. Digital Chaos Engineered with ❤️
              </p>
            </div>

            {/* Right side - Responsible gaming */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 leading-relaxed font-body">
                18+ Only. Please gamble responsibly. Games are intended for adult audiences only.{' '}
                <a
                  href="#"
                  className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline"
                >
                  Learn More
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;