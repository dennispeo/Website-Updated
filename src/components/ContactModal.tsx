import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Building, User, MessageSquare } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    inquiryType: 'Operator',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { trackFormSubmit } = useAnalytics();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 200);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        if (e.key === 'Tab') {
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
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission
    trackFormSubmit('partnership-inquiry');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after showing success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', inquiryType: 'Operator', message: '' });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', inquiryType: 'Operator', message: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="relative bg-brand-dark rounded-2xl w-full max-w-[600px] shadow-2xl border border-gray-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Header */}
        <div className="bg-brand-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 
                id="contact-modal-title"
                className="text-2xl font-heading font-bold text-brand-dark"
              >
                Partner with PlayEola
              </h2>
              <p className="text-brand-dark/80 font-body mt-1">
                Let's create digital chaos together
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-brand-dark hover:text-brand-dark/70 transition-colors duration-200 disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-brand-dark" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-300 font-body">
                We'll get back to you within 24 hours to discuss your partnership opportunity.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    ref={firstInputRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Company *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              {/* Inquiry Type Field */}
              <div>
                <label htmlFor="inquiryType" className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                >
                  <option value="Operator">Operator</option>
                  <option value="Platform">Platform</option>
                  <option value="Affiliate">Affiliate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Partnership Intent *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 resize-none font-body disabled:opacity-50"
                    placeholder="Tell us about your partnership goals, target markets, or specific collaboration ideas..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,163,56,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-body"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Message...</span>
                  </span>
                ) : (
                  'Send Partnership Inquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;