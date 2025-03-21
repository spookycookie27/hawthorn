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
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import { FaTags, FaInfoCircle, FaArrowRight } from 'react-icons/fa';

import './Gigs.css';

const Gigs = () => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setShowDetail] = useState(false);

  useEffect(() => {
    moment.locale('gb');
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/events/get`
      );
      const events = await response.json();
      setEvents(events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public events:', error);
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
    setShowDetail(true);
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
                key={e._id}
              >
                <tr onClick={() => onRowClick(e)}>
                  <td>{moment(e.eventDate).format('DD MMM YYYY')}</td>
                  <td className='d-none d-sm-table-cell'>{getGigTimes(e)}</td>
                  <td>{e.city}</td>
                  <td className='d-none d-sm-table-cell'>
                    {e.isPrivate ? 'Private event' : e.venue}
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
    <Container className='Gigs'>
      <h2 className='section-heading'>LIVE</h2>
      <div className='section-heading-line white' />
      <p>
        The gigs below are open to members of the public so you are more than
        welcome to come along. Click below to view the full list of gigs
        including both private and public events. For availability please send a
        message via the contact page.
      </p>
      <div className='link'>
        <NavLink to={'/giglist'}>
          FULL GIG LIST &nbsp;
          <FaArrowRight />
        </NavLink>
      </div>
      <Row>
        <Col md={12}>{loading ? null : renderGigsTable()}</Col>
      </Row>
    </Container>
  );
};

export default Gigs;
