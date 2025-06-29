import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Games from '../components/Games';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Games />
      <Footer />
    </>
  );
};

export default HomePage;