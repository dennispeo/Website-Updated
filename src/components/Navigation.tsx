import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'About', href: 'about', type: 'scroll' },
    { label: 'Games', href: 'games', type: 'scroll' },
    { label: 'Our Team', href: '/about/our-team', type: 'route' },
    { label: 'Backoffice', href: '/backoffice', type: 'route' },
    { label: 'Careers', href: '/about-us/careers', type: 'route' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-dark/90 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="/PLAY_E_OLA_Logo White-gold.png" 
                alt="Play E Ola" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                link.type === 'route' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="nav-link text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative group font-body"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="nav-link text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative group font-body"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
                  </button>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-brand-orange transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-brand-dark/95 backdrop-blur-sm z-40 transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col pt-20 px-6 space-y-6">
          {navLinks.map((link) => (
            link.type === 'route' ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left text-lg font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-colors duration-200 py-2 font-body"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-left text-lg font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-colors duration-200 py-2 font-body"
              >
                {link.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;