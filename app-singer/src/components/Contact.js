import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import ScrollTo from 'react-scroll-into-view';
import * as validator from 'validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faYoutube,
  faSpotify,
} from '@fortawesome/free-brands-svg-icons';

import './Contact.scss';

const Contact = () => {
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [telephone, setTelephone] = useState('');
  const [isTelephoneValid, setIsTelephoneValid] = useState(true);
  const [message, setMessage] = useState('');
  const [isMessageValid, setIsMessageValid] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableSend, setDisableSend] = useState(false);

  const isFormValid = () => {
    return (
      isNameValid &&
      isEmailValid &&
      isTelephoneValid &&
      isMessageValid &&
      !showConfirm
    );
  };

  const handleSend = async () => {
    setDisableSend(true);

    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/enquiry/postContact`,
        {
          method: 'POST',
          body: JSON.stringify({ name, email, telephone, message }),
          headers,
        }
      );

      if (response.ok) {
        setName('');
        setEmail('');
        setTelephone('');
        setMessage('');
        setShowConfirm(true);
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setDisableSend(false);
    }
  };

  return (
    <section className='Contact' id='contact'>
      <div className='wrapper'>
        <div className='background-video-container'>
          <video src='./images/HungryForYou.mp4' autoPlay muted loop />
        </div>
        <div className='full-width-backdrop' />
        <Container className='contact-grid' fluid>
          <Row className='footer-content'>
            <Col
              xs={12}
              md={{ span: 5, order: 'last' }}
              className='footer-right position-relative'
            >
              <div className='overlay d-none d-md-block' />
              <Form>
                <Row>
                  <Col xs={{ span: 9, offset: 3 }}>
                    <p>TODO api</p>
                    <p>
                      For all enquiries please use the contact form below or
                      email{' '}
                      <a href='mailto:info@amyhawthorn.com'>
                        info@amyhawthorn.com
                      </a>
                    </p>
                  </Col>
                </Row>
                <Form.Group as={Row} className='mb-3' controlId='formName'>
                  <Form.Label column sm='3'>
                    Name
                  </Form.Label>
                  <Col sm='9'>
                    <Form.Control
                      type='text'
                      value={name}
                      placeholder='Enter your name'
                      onChange={(e) => {
                        setName(e.target.value);
                        setIsNameValid(
                          validator.isLength(e.target.value, {
                            min: 1,
                            max: 50,
                          })
                        );
                      }}
                      isInvalid={!isNameValid}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Name is required.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-3' controlId='formEmail'>
                  <Form.Label column sm='3'>
                    Email
                  </Form.Label>
                  <Col sm='9'>
                    <Form.Control
                      type='email'
                      value={email}
                      placeholder='Enter your email'
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsEmailValid(validator.isEmail(e.target.value));
                      }}
                      isInvalid={!isEmailValid}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Enter a valid email address.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-3' controlId='formTelephone'>
                  <Form.Label column sm='3'>
                    Telephone
                  </Form.Label>
                  <Col sm='9'>
                    <Form.Control
                      type='text'
                      value={telephone}
                      placeholder='Enter your telephone'
                      onChange={(e) => {
                        setTelephone(e.target.value);
                        setIsTelephoneValid(
                          validator.isLength(e.target.value, {
                            min: 1,
                            max: 15,
                          })
                        );
                      }}
                      isInvalid={!isTelephoneValid}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Telephone is required.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-3' controlId='formMessage'>
                  <Form.Label column sm='3'>
                    Message
                  </Form.Label>
                  <Col sm='9'>
                    <Form.Control
                      as='textarea'
                      value={message}
                      placeholder='Write your message here'
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setIsMessageValid(
                          validator.isLength(e.target.value, {
                            min: 1,
                            max: 1000,
                          })
                        );
                      }}
                      isInvalid={!isMessageValid}
                      style={{ height: 200 }}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Message is required.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <div className='button-container'>
                  {!showConfirm && (
                    <Button
                      variant='success'
                      onClick={handleSend}
                      disabled={!isFormValid() || disableSend}
                      className='submit-button'
                    >
                      SEND MESSAGE
                    </Button>
                  )}
                  {showConfirm && (
                    <div>
                      Thanks for your email, I will reply as soon as I can.{' '}
                      <br />
                      Amy x
                    </div>
                  )}
                </div>
              </Form>
            </Col>
            <Col
              xs={12}
              md={{ span: 7, order: 'first' }}
              className='footer-left'
            >
              <div className='footer-nav'>
                <ul className='d-none d-md-block'>
                  <li className='nav-link'>
                    <ScrollTo selector='#music'>MUSIC</ScrollTo>
                  </li>
                  <li className='nav-link'>
                    <ScrollTo selector='#videos'>VIDEOS</ScrollTo>
                  </li>
                  <li className='nav-link'>
                    <ScrollTo selector='#gigs'>LIVE</ScrollTo>
                  </li>
                  <li className='nav-link'>
                    <ScrollTo selector='#about'>ABOUT</ScrollTo>
                  </li>
                </ul>
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
                <Image
                  src='/images/amy-logo.png'
                  className='footer-logo'
                  fluid
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Contact;
