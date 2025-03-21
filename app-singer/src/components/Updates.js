import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as moment from 'moment';
import './Updates.css';

const Updates = () => {
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/blogposts`,
        { method: 'GET', headers }
      );
      const posts = await response.json();
      setPost(posts[0]);
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const setActivePost = (id) => {
    const activePost = posts.find((p) => p.id === id);
    setPost(activePost);
  };

  const renderRecentNews = () => {
    if (posts.length === 0 || post === null) return null;
    const otherPosts = posts.filter((p) => p.id !== post.id);
    return otherPosts.map((p) => (
      <div className='post-snippet' key={p.id}>
        <h4>
          <a onClick={() => setActivePost(p.id)}>{p.pageTitle}</a>
        </h4>
        <p>{moment(p.datePublished).format('Do MMMM YYYY, h:mm a')}</p>
      </div>
    ));
  };

  const renderPost = () => {
    if (!post) return null;
    return (
      <div className='post'>
        <h3 className='post-heading'>{post.pageTitle}</h3>
        <p>{moment(post.datePublished).format('Do MMMM YYYY h:mm a')}</p>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    );
  };

  return (
    <Container>
      <Row className='Updates'>
        <h2 className='section-heading'>LATEST UPDATES</h2>
        <div className='section-heading-line' />
        <Col sm={9}>{loading ? null : renderPost()}</Col>
        <Col sm={3} className='more-news'>
          <h3 className='post-heading'>MORE NEWS</h3>
          <div className='section-heading-line' />
          {renderRecentNews()}
        </Col>
      </Row>
    </Container>
  );
};

export default Updates;
