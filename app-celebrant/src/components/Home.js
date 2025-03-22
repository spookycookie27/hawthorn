import React from 'react';
import About from './About';
import Contact from './Contact';
import AnimatedSlider from './AnimatedSlider';
// import { Updates } from './Updates';

import './Home.scss';

const Home = () => {
  return (
    <div className='Home'>
      <section id='top-slider' className='slider-container'>
        <AnimatedSlider />
      </section>
      <section id='about' className='about-container'>
        <About />
      </section>
      {/* <section id="updates" className="updates-container"><Updates /></section> */}
      <Contact />
    </div>
  );
};

export default Home;
