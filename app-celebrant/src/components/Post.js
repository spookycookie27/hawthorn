import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import * as moment from 'moment';

const Post = () => {
  const { id } = useParams();
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
        `${process.env.REACT_APP_API_URL}/api/blogposts`,
        { method: 'GET', headers }
      );
      const posts = await response.json();
      const activePost = posts.find((p) => p.slug === id);
      setPost(activePost);
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
      <div key={p.id} className='post-snippet'>
        <h4>
          <NavLink to={`/news/${p.slug}`} onClick={() => setActivePost(p.id)}>
            {p.pageTitle}
          </NavLink>
        </h4>
        <p>{moment(p.datePublished).format('Do MMMM YYYY, h:mm a')}</p>
      </div>
    ));
  };

  const renderPost = () => {
    if (!post) return null;
    return (
      <div className='post'>
        <h1>{post.pageTitle}</h1>
        <p>{moment(post.datePublished).format('Do MMMM YYYY h:mm a')}</p>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    );
  };

  return (
    <Container>
      <Row className='News'>
        <Col sm={9}>{loading ? null : renderPost()}</Col>
        <Col sm={3}>
          <h2>More recent news</h2>
          {renderRecentNews()}
        </Col>
      </Row>
    </Container>
  );
};

export default Post;
