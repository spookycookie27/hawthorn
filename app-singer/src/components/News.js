import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const headers = new Headers();
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/blogposts`,
          {
            method: 'GET',
            headers,
          }
        );
        const posts = await response.json();
        setPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const renderNewsItems = () => {
    return posts.map((p) => (
      <Row key={p.id} className='mb-4'>
        <Col sm={9}>
          <h2>
            <NavLink to={`/news/${p.slug}`}>{p.pageTitle}</NavLink>
          </h2>
          <p>{moment(p.datePublished).format('Do MMMM YYYY, h:mm a')}</p>
        </Col>
        <Col sm={3}>
          <Image src={p.imageUrl} alt={p.pageTitle} fluid />
        </Col>
      </Row>
    ));
  };

  return (
    <Container>
      <Row className='News'>
        <Col sm={12}>
          <h2 className='section-heading'>Latest News</h2>
          {loading ? <p>Loading...</p> : renderNewsItems()}
        </Col>
      </Row>
    </Container>
  );
};

export default News;
