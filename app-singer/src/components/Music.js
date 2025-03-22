import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

import './Music.scss';

const Music = () => {
  const renderItem = (url, title, linkUrl) => {
    return (
      <Col xs={6} md={3} className='item-container' key={title}>
        <a href={linkUrl} target='_blank' rel='noreferrer'>
          <Image src={url} fluid />
        </a>
        {/* <div className='music-title'>{title}</div> */}
      </Col>
    );
  };

  return (
    <Container className='Music pt-5'>
      <h2 className='section-heading'>MUSIC</h2>
      <div className='section-heading-line' />
      <Row>
        {renderItem(
          '/images/TFI.jpg',
          'THE FIGHT INSIDE',
          'https://itunes.apple.com/us/album/the-fight-inside-single/1167690614'
        )}
        {renderItem(
          '/images/HFY.jpg',
          'HUNGRY FOR YOU',
          'https://itunes.apple.com/us/album/hungry-for-you-single/754019538'
        )}
        {renderItem(
          '/images/HFUR.jpg',
          'HUNGRY (REMIX)',
          'https://itunes.apple.com/us/album/hungry-for-you-drum-bass-remix/784493107?i=784493111'
        )}
        {renderItem(
          '/images/ROT.jpg',
          'RHYTHM OF THE RAIN',
          'https://itunes.apple.com/us/album/rhythm-of-the-rain/1060517213?i=1060517216'
        )}
      </Row>
    </Container>
  );
};

export default Music;
