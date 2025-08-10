import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutSubMenu, setShowAboutSubMenu] = useState(false);
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
    { 
      label: 'About Us', 
      href: 'about', 
      type: 'scroll',
      subLinks: [
        { label: 'The Team', href: '/about/our-team', type: 'route' },
        { label: 'Join Us', href: '/about-us/careers', type: 'route' }
      ]
    },
    { label: 'Our Games', href: 'games', type: 'scroll' },
    { label: 'Client Area', href: '/backoffice', type: 'route' }
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
                <div key={link.label} className="relative group">
                  {link.subLinks ? (
                    // Dropdown menu for items with subLinks
                    <>
                      {link.type === 'route' ? (
                        <Link
                          to={link.href}
                          className="nav-link flex items-center space-x-1 text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative font-body"
                        >
                          <span>{link.label}</span>
                          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="nav-link flex items-center space-x-1 text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative font-body"
                        >
                          <span>{link.label}</span>
                          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>
                      )}
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-brand-dark/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {link.subLinks.map((subLink) => (
                            subLink.type === 'route' ? (
                              <Link
                                key={subLink.label}
                                to={subLink.href}
                                className="block px-4 py-2 text-sm font-semibold text-white hover:text-brand-orange hover:bg-black/30 transition-all duration-200 font-body"
                              >
                                {subLink.label}
                              </Link>
                            ) : (
                              <button
                                key={subLink.label}
                                onClick={() => scrollToSection(subLink.href)}
                                className="block w-full text-left px-4 py-2 text-sm font-semibold text-white hover:text-brand-orange hover:bg-black/30 transition-all duration-200 font-body"
                              >
                                {subLink.label}
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Regular menu items without subLinks
                    link.type === 'route' ? (
                      <Link
                        to={link.href}
                        className="nav-link text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative group font-body"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="nav-link text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative group font-body"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    )
                  )}
                </div>
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
            <div key={link.label}>
              {link.subLinks ? (
                // Mobile dropdown for items with subLinks
                <>
                  {link.type === 'route' ? (
                    <div>
                      <button
                        onClick={() => setShowAboutSubMenu(!showAboutSubMenu)}
                        className="flex items-center justify-between w-full text-left text-lg font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-colors duration-200 py-2 font-body"
                      >
                        <span>{link.label}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${showAboutSubMenu ? 'rotate-180' : ''}`} />
                      </button>
                      {showAboutSubMenu && (
                        <div className="ml-4 mt-2 space-y-2">
                          {link.subLinks.map((subLink) => (
                            subLink.type === 'route' ? (
                              <Link
                                key={subLink.label}
                                to={subLink.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-gray-300 hover:text-brand-orange transition-colors duration-200 py-1 font-body"
                              >
                                {subLink.label}
                              </Link>
                            ) : (
                              <button
                                key={subLink.label}
                                onClick={() => {
                                  scrollToSection(subLink.href);
                                  setShowAboutSubMenu(false);
                                }}
                                className="block w-full text-left text-base font-semibold text-gray-300 hover:text-brand-orange transition-colors duration-200 py-1 font-body"
                              >
                                {subLink.label}
                              </button>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setShowAboutSubMenu(!showAboutSubMenu)}
                        className="flex items-center justify-between w-full text-left text-lg font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-colors duration-200 py-2 font-body"
                      >
                        <span>{link.label}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${showAboutSubMenu ? 'rotate-180' : ''}`} />
                      </button>
                      {showAboutSubMenu && (
                        <div className="ml-4 mt-2 space-y-2">
                          {link.subLinks.map((subLink) => (
                            subLink.type === 'route' ? (
                              <Link
                                key={subLink.label}
                                to={subLink.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-gray-300 hover:text-brand-orange transition-colors duration-200 py-1 font-body"
                              >
                                {subLink.label}
                              </Link>
                            ) : (
                              <button
                                key={subLink.label}
                                onClick={() => {
                                  scrollToSection(subLink.href);
                                  setShowAboutSubMenu(false);
                                }}
                                className="block w-full text-left text-base font-semibold text-gray-300 hover:text-brand-orange transition-colors duration-200 py-1 font-body"
                              >
                                {subLink.label}
                              </button>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Regular mobile menu items without subLinks
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
                    onClick={() => {
                      scrollToSection(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="nav-link text-sm font-bold uppercase tracking-widest text-white hover:text-brand-orange transition-all duration-200 relative group font-body"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
                  </button>
                )
              )}
            </div>
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