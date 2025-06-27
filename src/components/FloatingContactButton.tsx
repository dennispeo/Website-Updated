import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ContactModal from './ContactModal';

const FloatingContactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed right-6 bottom-6 z-40 group bg-brand-gradient text-brand-dark p-4 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(234,163,56,0.6)] transition-all duration-300 hover:scale-110"
        aria-label="Contact us for partnership opportunities"
      >
        <MessageCircle size={24} className="group-hover:animate-pulse" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-brand-dark text-white px-3 py-2 rounded-lg text-sm font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Partner with us
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-brand-dark"></div>
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-brand-gradient animate-ping opacity-20"></div>
      </button>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FloatingContactButton;