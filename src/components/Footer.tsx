import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 bg-brand-dark-gradient border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-heading font-bold text-brand-orange mb-4 uppercase tracking-wider">
            Contact Us
          </h3>
          <p className="text-gray-300 mb-6 font-body max-w-2xl mx-auto">
            Ready to partner with us? Have questions about our games or mechanics? 
            We'd love to hear from you.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Mail className="text-brand-orange" size={20} />
            <a 
              href="mailto:info@playeola.com"
              className="text-lg font-semibold text-white hover:text-brand-orange transition-colors duration-300 font-body"
            >
              info@playeola.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto font-body text-center">
            18+ Only. Please gamble responsibly. Games are intended for adult audiences only.{' '}
            <a
              href="#"
              className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 hover:underline"
            >
              Learn More
            </a>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600 font-body">
            © 2025 Play E Ola. All rights reserved. Digital Chaos Engineered with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;