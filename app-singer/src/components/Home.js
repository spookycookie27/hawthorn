import React from 'react';
import AnimatedSlider from './AnimatedSlider';
import Music from './Music';
import Video from './Video';
import Gigs from './Gigs';
import About from './About';
// import { Instagram } from './Instagram';
import Contact from './Contact';
// import { Updates } from './Updates';

import './Home.scss';

const Home = () => {
  return (
    <div className='Home'>
      <section id='top-slider' className='slider-container'>
        <AnimatedSlider />
      </section>
      <section id='music' className='music-container'>
        <Music />
      </section>
      <section id='videos' className='video-container'>
        <Video />
      </section>
      <section id='gigs' className='gigs-container'>
        <Gigs />
      </section>
      <section id='about' className='about-container'>
        <About />
      </section>
      {/* <section id="instagram" className="instagram-container"><Instagram /></section> */}
      {/* <section id="updates" className="updates-container"><Updates /></section> */}
      <Contact />
    </div>
  );
};

export default Home;
