import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Container,
  Table,
  Popover,
  OverlayTrigger,
  Image,
} from 'react-bootstrap';
import Contact from './Contact';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import { FaTags, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

import './GigList.css';

const GigList = () => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moment.locale('gb');
    refreshData();
    window.scrollTo(0, 0);
  }, []);

  const refreshData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/Events/GetFutureEvents/`
      );
      const events = await response.json();
      setEvents(events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getGigTimes = (e) => {
    const startTime = moment(e.eventDate);
    const endTime = moment(e.eventDate)
      .hour(e.endTime.substring(0, 2))
      .minute(e.endTime.substring(3, 5));
    return `${startTime.format('h:mm')} - ${endTime.format('h:mm a')}`;
  };

  const onRowClick = (gig) => {
    setEvent(gig);
  };

  const renderGigsTable = () => {
    const detailCol = event && event.googleMapLink ? 6 : 9;
    const popover = (
      <Popover id='popover' className='gig-popover'>
        {event && (
          <Row>
            <Col sm={detailCol}>
              <h3>{event.venue}</h3>
              <p>{event.city}</p>
              <p>{moment(event.eventDate).format('DD MMM YYYY')}</p>
              <p>{getGigTimes(event)}</p>
              <h4>{event.name}</h4>
              <p>{event.description}</p>
              {event.ticketUrl && (
                <p>
                  <FaTags />
                  <a
                    href={event.ticketUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    &nbsp;TICKETS HERE
                  </a>
                </p>
              )}
            </Col>
            {event.googleMapLink && (
              <Col sm={6}>
                <div className='maps-container'>
                  <div
                    dangerouslySetInnerHTML={{ __html: event.googleMapLink }}
                  />
                </div>
              </Col>
            )}
            {!event.googleMapLink && (
              <Col sm={3} className='d-none d-sm-block'>
                <Image src='./images/FB_IMG_1488927166505.jpg' fluid />
              </Col>
            )}
          </Row>
        )}
      </Popover>
    );

    return (
      <div className='public-gigs'>
        <Table className='gigs-table' responsive hover>
          <tbody>
            {events.map((e) => (
              <OverlayTrigger
                trigger='click'
                placement='bottom'
                overlay={popover}
                rootClose
                key={e.id}
              >
                <tr onClick={() => onRowClick(e)}>
                  <td>{moment(e.eventDate).format('DD MMM YYYY')}</td>
                  <td className='d-none d-sm-table-cell'>{getGigTimes(e)}</td>
                  <td>{e.isPrivate ? 'Private event' : e.city}</td>
                  <td className='d-none d-sm-table-cell'>
                    {e.isPrivate ? '' : e.venue}
                  </td>
                  <td>
                    <FaInfoCircle onClick={() => onRowClick(e)} />
                  </td>
                </tr>
              </OverlayTrigger>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div className='GigList'>
      <section id='gigs' className='gigs-container'>
        <Container className='Gigs'>
          <h2 className='section-heading'>COMPLETE LIST OF LIVE GIGS</h2>
          <div className='section-heading-line white' />
          <p>
            Please check back regularly for updates as new dates are added every
            week.
          </p>
          <div className='link'>
            <NavLink to={'/'}>
              <FaArrowLeft />
              &nbsp;BACK TO HOME
            </NavLink>
          </div>
          <Row>
            <Col md={12}>{loading ? null : renderGigsTable()}</Col>
          </Row>
        </Container>
      </section>
      <Contact />
    </div>
  );
};

export default GigList;
