import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { getDefaultContent } from '../constants';
import './About.scss';

const About = () => {
  const [post, setPost] = useState(null);
  console.log(post);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/blogposts/get`
        );
        const posts = await response.json();
        const foundPost = posts.find((e) => e.pageTitle === 'About');
        setPost(foundPost);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const resolveContent = () => {
    if (post) {
      return <div dangerouslySetInnerHTML={{ __html: post.body }} />;
    }
    return getDefaultContent();
  };
  return (
    <Container className='About' fluid='md'>
      <Row>
        <Col lg={5}>
          {resolveContent()}
          <div className='share'>
            <span>Share</span>
            <div className='icons-container'>
              <a
                href='https://www.facebook.com/AmyHawthorn/'
                className='social-link'
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href='https://twitter.com/amyvhawthorn/'
                className='social-link'
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href='https://www.instagram.com/amyvhaw/'
                className='social-link'
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href='https://www.youtube.com/user/AmyHawthornTV'
                className='social-link'
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a
                href='https://open.spotify.com/artist/2QdouLcTk4sn6rU6wgAviF'
                className='social-link'
              >
                <FontAwesomeIcon icon={faSpotify} />
              </a>
            </div>
          </div>
        </Col>
        <Col lg={7}>
          <div className='image-wrapper'>
            <div
              className='image-right'
              style={{
                backgroundImage: 'url(/images/IMG_20170819_191644_578.jpg)',
              }}
            />
            <div
              className='image-center'
              style={{ backgroundImage: 'url(/images/LS-041117-3727.jpg)' }}
            />
          </div>
          <div className='image-wrapper'>
            {' '}
            <div
              className='image-bottom'
              style={{ backgroundImage: 'url(/images/amy-close3.jpg)' }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
