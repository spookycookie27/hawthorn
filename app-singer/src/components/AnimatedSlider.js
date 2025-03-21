import React from 'react';
import { Image } from 'react-bootstrap';
import Slider from 'react-animated-slider';
import ScrollTo from 'react-scroll-into-view';
import { FaPlay, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import 'react-animated-slider/build/horizontal.css';
import './AnimatedSlider.scss';

const content = [
  {
    title: 'Latest Video',
    button: 'WATCH NOW',
    backgroundImage: '/images/slide5.jpg',
    image: '/images/ah-logo.png',
    linkTo: '#videos',
  },
  {
    title: 'Music',
    button: 'LISTEN HERE',
    backgroundImage: '/images/slide7.jpg',
    linkTo: '#music',
  },
  {
    title: 'About Amy',
    description:
      'Amy Hawthorn is a Singer/Songwriter from West Lothian, Scotland',
    button: 'DISCOVER',
    backgroundImage: '/images/slide6.jpg',
    linkTo: '#about',
  },
  {
    title: 'Live',
    description: 'See where Amy is playing in the coming months',
    button: 'DISCOVER',
    backgroundImage: '/images/slide8.jpg',
    linkTo: '#gigs',
  },
];

const AnimatedSlider = () => {
  return (
    <Slider
      className='slider-wrapper'
      infinite
      autoplay='4000'
      nextButton={<FaAngleRight size={'2em'} color='white' />}
      previousButton={<FaAngleLeft size={'2em'} color='white' />}
    >
      {content.map((item, index) => (
        <div
          key={index}
          className={`slider-content slide-${index + 1}`}
          style={{
            background: `url(${item.backgroundImage}) no-repeat center center`,
          }}
        >
          <div className='inner'>
            {item.image && <Image src={item.image} fluid />}
            {item.title && <h1>{item.title}</h1>}
            {item.description && <p>{item.description}</p>}
            {item.button && (
              <ScrollTo
                selector={item.linkTo}
                className='d-flex justify-content-center align-items-center'
              >
                <button className='d-flex justify-content-center align-items-center'>
                  {item.button} <FaPlay className='ms-2' />
                </button>
              </ScrollTo>
            )}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default AnimatedSlider;
