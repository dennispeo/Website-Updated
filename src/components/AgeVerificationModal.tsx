import React, { useState, useEffect, useRef } from 'react';

const AgeVerificationModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Show modal on every page load with a small delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus on primary button when modal opens
      setTimeout(() => {
        primaryButtonRef.current?.focus();
      }, 200);
      
      // Handle keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          // Focus trap within modal
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  const handleYes = () => {
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleNo = () => {
    window.location.href = 'https://google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85"></div>
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="relative bg-brand-dark rounded-2xl p-8 w-full max-w-[480px] text-center shadow-2xl border border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-verification-title"
        aria-describedby="age-verification-description"
      >
        {/* Heading */}
        <h2 
          id="age-verification-title"
          className="text-2xl md:text-3xl font-heading font-bold text-white mb-6"
        >
          Are you over 18?
        </h2>
        
        {/* Description */}
        <p 
          id="age-verification-description"
          className="text-gray-300 text-lg leading-relaxed mb-8 font-body"
        >
          This site contains content intended for adults in the gaming industry. 
          Please confirm your age to continue.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary Button */}
          <button
            ref={primaryButtonRef}
            onClick={handleYes}
            className="group relative px-8 py-4 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,163,56,0.5)] hover:scale-105 font-body"
          >
            <span className="relative z-10">Yes, I'm over 18</span>
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
          </button>
          
          {/* Secondary Button */}
          <button
            onClick={handleNo}
            className="group px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:border-brand-orange hover:text-brand-orange hover:shadow-[0_0_15px_rgba(234,163,56,0.3)] hover:scale-105 font-body"
          >
            No, take me back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;