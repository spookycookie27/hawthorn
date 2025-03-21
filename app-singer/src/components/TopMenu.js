import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ScrollTo from 'react-scroll-into-view';
import { isSignedIn, signOut } from '../services/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF, faInstagram, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';

import './TopMenu.scss';

const TopMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogoutClick = () => {
    signOut();
    navigate('/');
  };

  const onAdminClick = (path) => {
    navigate(path);
  };

  const loggedIn = isSignedIn();
  const isHomePage = location.pathname === '/';

  return (
    <Navbar expand="lg" className="TopMenu" fixed="top">
      <Container fluid="md">
        <div>
          <Navbar.Brand>
            <NavLink to={'/'}>AMY HAWTHORN</NavLink>
          </Navbar.Brand>
          <div className="icons-container">
            <a href="https://www.facebook.com/AmyHawthorn/" className="social-link"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="https://twitter.com/amyvhawthorn/" className="social-link"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://www.instagram.com/amyvhaw/" className="social-link"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://www.youtube.com/user/AmyHawthornTV" className="social-link"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="https://open.spotify.com/artist/2QdouLcTk4sn6rU6wgAviF" className="social-link"><FontAwesomeIcon icon={faSpotify} /></a>
          </div>
        </div>
        <Navbar.Toggle aria-controls="topmenu-navbar" />
        <Navbar.Collapse id="topmenu-navbar">
          <Nav className="ms-auto">
            {loggedIn && (
              <NavDropdown title="ADMIN" id="admin-nav-dropdown">
                <NavDropdown.Item onClick={() => onAdminClick('/admin/news')}>News</NavDropdown.Item>
                <NavDropdown.Item onClick={() => onAdminClick('/admin/gigs')}>Live</NavDropdown.Item>
                <NavDropdown.Item onClick={() => onAdminClick('/admin/videos')}>Videos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogoutClick}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
            {isHomePage && (
              <>
                <Nav.Link as={ScrollTo} selector="#music">MUSIC</Nav.Link>
                <Nav.Link as={ScrollTo} selector="#videos">VIDEOS</Nav.Link>
                <Nav.Link as={ScrollTo} selector="#gigs">LIVE</Nav.Link>
                <Nav.Link as={ScrollTo} selector="#about">ABOUT</Nav.Link>
                <Nav.Link as={ScrollTo} selector="#contact">CONTACT</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopMenu;