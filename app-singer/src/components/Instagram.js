import React, { useState, useEffect } from 'react';
import { Grid, Modal, Button, Image, Row, Col } from 'react-bootstrap';
import Slider from 'react-slick';
import * as moment from 'moment';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Instagram.css';

const Instagram = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/Social/GetInstagramFeed`
    ).then((response) => {
      if (response.status === 204) return;
      response.json().then((data) => {
        setMedia(data);
        setLoading(false);
      });
    });
  };

  const handleClose = () => setShow(false);

  const onItemClick = (item) => {
    setItem(item);
    setShow(true);
  };

  const renderItem = () => {
    if (!item) return null;
    const content =
      item.type !== 'video' ? (
        <Image src={item.images.standardResolution.url} responsive />
      ) : (
        <video src={item.videos.standardResolution.url} controls width='100%' />
      );
    const date = moment(item.sortDate).format('DD MMM YYYY');
    return (
      <Modal.Body>
        <div className='content-container'>{content}</div>
        <div className='date'>Date: {date}</div>
        <div className='likes'>Likes: {item.likeCount}</div>
        {item.location && <div>Location: {item.location.name}</div>}
      </Modal.Body>
    );
  };

  const renderFeedItems = () => {
    if (!media) return null;
    return media.map((i) => (
      <div key={i.id} className='feed-item'>
        <div className='inner-wrapper'>
          <div
            className='inner-box'
            style={{ backgroundImage: `url(${i.images.lowResolution.url})` }}
            onClick={() => onItemClick(i)}
          />
        </div>
      </div>
    ));
  };

  const getCaptionText = () => {
    if (!item || !item.captionText) return null;
    const index = item.captionText.indexOf('#', 0);
    return item.captionText.substring(0, index - 6);
  };

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    slidesToShow: 5,
    speed: 500,
    dots: true,
    autoPlay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!media) return null;

  return (
    <Grid className='Instagram'>
      <h2 className='section-heading'>FROM MY INSTAGRAM FEED</h2>
      <Row className='feed-items-row'>
        <Col md={12}>
          <Slider {...settings} className='slider-container'>
            {loading ? null : renderFeedItems()}
          </Slider>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} className='insta-modal'>
        <Modal.Header>{item && getCaptionText()}</Modal.Header>
        {renderItem()}
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Grid>
  );
};

export default Instagram;
