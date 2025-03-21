import React from 'react';
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import './Home.scss';

const NotFound = () => {
  return (
    <div className='Home'>
      <Container>
        <h2>This page could not be found :(</h2>
        <p>Click the link below to visit the new website</p>
        <div className='link'>
          <NavLink to={'/'}>
            <FaArrowLeft />
            &nbsp;BACK TO HOME
          </NavLink>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
