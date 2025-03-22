import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Form, Button } from 'react-bootstrap';
import * as validator from 'validator';
import { setToken } from '../services/Auth';

import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPassValid, setIsPassValid] = useState(true);

  const isFormValid = () => {
    return isEmailValid && isPassValid;
  };

  const onEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsEmailValid(validator.isEmail(emailValue));
  };

  const onPasswordChange = (e) => {
    const passValue = e.target.value;
    setPass(passValue);
    setIsPassValid(validator.isLength(passValue, { min: 8, max: 20 }));
  };

  const onLogin = async () => {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({ email, pass }),
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        navigate('/admin/gigs');
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Row className='Login'>
      <Col sm={6} className='mx-auto'>
        <h1>Welcome back, Amy!</h1>
        <Form className='form'>
          <Form.Group controlId='formLogin'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='text'
              value={email}
              placeholder='Enter your email'
              onChange={onEmailChange}
              isInvalid={!isEmailValid && email.length > 0}
            />
            <Form.Control.Feedback type='invalid'>
              Must be a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='formPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={pass}
              placeholder='Enter your password'
              onChange={onPasswordChange}
              isInvalid={!isPassValid && pass.length > 0}
            />
            <Form.Control.Feedback type='invalid'>
              Password should be 8 characters or more.
            </Form.Control.Feedback>
          </Form.Group>
          <div className='button-container'>
            <Button
              variant='success'
              size='lg'
              onClick={onLogin}
              block
              disabled={!isFormValid()}
            >
              Log in
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
