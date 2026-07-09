import React from 'react';
import Hero from '../components/landing/Hero';
import Courses from '../components/landing/Courses';
import Benefits from '../components/landing/Benefits';
import FAQ from '../components/landing/FAQ';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Courses />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
};

export default Home;
