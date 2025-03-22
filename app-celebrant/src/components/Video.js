import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ReactPlayer from 'react-player';

import './Video.css';

const Video = () => {
  const [videoUrl, setVideoUrl] = useState(
    'https://www.musicforscotland.co.uk/Content/MFSMontage2017.mp4'
  );
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/videos/get`
      );
      const data = await response.json();
      setVideos(data);
      setVideoUrl(data[0]?.url || videoUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const onItemClick = (url) => {
    console.log(url);
    setVideoUrl(url);
  };

  const renderItem = (video) => (
    <Col
      xs={6}
      md={3}
      className='video-link'
      key={video._id}
      onClick={() => onItemClick(video.url)}
    >
      <Image src={video.imageUrl} fluid />
    </Col>
  );

  if (loading) return null;

  return (
    <Container className='Video'>
      <h2 className='section-heading'>VIDEOS</h2>
      <div className='section-heading-line' />
      <Row>
        <Col sm={12} className='video-wrapper'>
          <ReactPlayer url={videoUrl} width='100%' />
        </Col>
      </Row>
      <Row className='video-links'>
        {videos.map((video) => renderItem(video))}
      </Row>
    </Container>
  );
};

export default Video;
