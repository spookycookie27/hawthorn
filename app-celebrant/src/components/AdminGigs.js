import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Col,
  Row,
  Container,
  Table,
  Button,
  Modal,
  Form,
  FormControl,
} from 'react-bootstrap';
import Datetime from 'react-datetime';
import * as moment from 'moment';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FaCheckCircle, FaMapMarker } from 'react-icons/fa';
import { getHeaders } from '../services/Auth';

import 'react-datetime/css/react-datetime.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import './AdminGigs.scss';

const AdminGigs = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [idToDelete, setIdToDelete] = useState(null);
  const [eventDate, setEventDate] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [googleMapLink, setGoogleMapLink] = useState('');
  const [city, setCity] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [venue, setVenue] = useState([]);
  const [venueOptions, setVenueOptions] = useState([]);
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/get/`,
      { method: 'GET', headers: getHeaders() }
    );
    if (response.ok) {
      const events = await response.json();
      const cityOptions = [];
      const venueOptions = [];
      events.forEach((x) => {
        if (!cityOptions.find((o) => o.label === x.city)) {
          cityOptions.push({ id: x.city, label: x.city });
        }
        if (!venueOptions.find((o) => o.label === x.venue)) {
          venueOptions.push({ id: x.venue, label: x.venue });
        }
      });
      setCityOptions(cityOptions);
      setVenueOptions(venueOptions);
      setEvents(events);
      setLoading(false);
    } else {
      navigate('/login');
    }
  };

  const handleSave = async () => {
    const hasId = !!idToEdit;
    const event = {
      city: city[0]?.label || city[0],
      venue: venue[0]?.label || venue[0],
      name,
      description,
      ticketUrl,
      googleMapLink,
      eventDate: moment(eventDate).format('YYYY-MM-DD H:mm'),
      endTime: moment(endTime).format('HH:mm:ss'),
      isPrivate,
    };
    if (hasId) {
      event.id = idToEdit;
    }

    const url = hasId
      ? `${process.env.REACT_APP_API_URL}/events/patch/${idToEdit}`
      : `${process.env.REACT_APP_API_URL}/events/post`;

    try {
      const response = await fetch(url, {
        method: hasId ? 'PATCH' : 'POST',
        body: JSON.stringify(event),
        headers: getHeaders(),
      });

      if (response.ok) {
        await refreshData();
        setShow(false);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async () => {
    const url = `${process.env.REACT_APP_API_URL}/events/delete/${idToDelete}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (response.ok) {
        await refreshData();
        setShowConfirm(false);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const onAddNew = () => {
    setIdToEdit('');
    setShow(true);
    setEventDate(moment().hour(21).minute(0));
    setEndTime(moment().hour(23).minute(0));
    setCity([]);
    setVenue([]);
    setName('');
    setDescription('');
    setTicketUrl('');
    setGoogleMapLink('');
    setIsPrivate(false);
  };

  const onEditClick = (id) => {
    const event = events.find((e) => e._id === id);
    setIdToEdit(id);
    setCity(event.city ? [event.city] : []);
    setVenue(event.venue ? [event.venue] : []);
    setEventDate(moment(event.eventDate));
    setEndTime(
      moment(event.eventDate)
        .hour(event.endTime.substring(0, 2))
        .minute(event.endTime.substring(3, 5))
    );
    setName(event.name || '');
    setDescription(event.description || '');
    setTicketUrl(event.ticketUrl || '');
    setGoogleMapLink(event.googleMapLink || '');
    setIsPrivate(event.isPrivate);
    setShow(true);
  };

  const onDeleteClick = (id) => {
    setIdToDelete(id);
    setShowConfirm(true);
  };

  const renderEditor = () => (
    <Row className='editor'>
      <Col md={6}>
        <Form>
          <Form.Group controlId='formDate' className='form-group'>
            <Form.Label>Enter date and start time of the event</Form.Label>
            <Datetime
              value={eventDate}
              dateFormat='dddd, MMMM Do YYYY'
              onChange={setEventDate}
              closeOnTab
            />
          </Form.Group>
          <Form.Group controlId='formTime' className='form-group'>
            <Form.Label>Enter the end time</Form.Label>
            <Datetime
              value={endTime}
              dateFormat={false}
              onChange={setEndTime}
              closeOnTab
            />
          </Form.Group>
          <Form.Group controlId='formVenue' className='form-group'>
            <Form.Label>Select venue from list</Form.Label>
            <div className='form-control-typeahead'>
              <Typeahead
                allowNew
                minLength={2}
                onChange={setVenue}
                options={venueOptions}
                selected={venue}
                clearButton
              />
            </div>
          </Form.Group>
          <Form.Group controlId='formCity' className='form-group'>
            <Form.Label>Select city from list</Form.Label>
            <div className='form-control-typeahead'>
              <Typeahead
                allowNew
                minLength={2}
                onChange={setCity}
                options={cityOptions}
                selected={city}
                clearButton
              />
            </div>
          </Form.Group>
          <Form.Group controlId='formName' className='form-group'>
            <Form.Label>Enter event name</Form.Label>
            <FormControl
              type='text'
              value={name}
              placeholder='Enter the event name'
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formDescription' className='form-group'>
            <Form.Label>Enter description</Form.Label>
            <FormControl
              as='textarea'
              value={description}
              placeholder='Enter the description'
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formTicketUrl' className='form-group'>
            <Form.Label>Enter ticket link</Form.Label>
            <FormControl
              type='text'
              value={ticketUrl}
              placeholder='Enter the url'
              onChange={(e) => setTicketUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formGoogleMapLink' className='form-group'>
            <Form.Label>Enter google map code</Form.Label>
            <FormControl
              type='text'
              value={googleMapLink}
              placeholder='Enter the embed code from share map'
              onChange={(e) => setGoogleMapLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formIsPrivate' className='form-group'>
            <Form.Check
              type='checkbox'
              label='Is private gig?'
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </Form.Group>
        </Form>
        <div className='button-container'>
          <Button variant='success' onClick={handleSave}>
            Update
          </Button>
          &nbsp;
          <Button onClick={() => setShow(false)}>Cancel</Button>
        </div>
      </Col>
    </Row>
  );

  const renderGigsTable = () => (
    <div className='AdminGigs'>
      <div className='button-container'>
        <Button variant='success' onClick={onAddNew}>
          Add a new event
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>City</th>
            <th>Venue</th>
            <th>Map</th>
            <th>Private?</th>
            <th className='action-column'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td className='align-middle'>
                {moment(e.eventDate).format('DD/MM/YYYY')}
              </td>
              <td className='align-middle'>{e.name}</td>
              <td className='align-middle'>{e.city}</td>
              <td className='align-middle'>{e.venue}</td>
              <td className='icon-cell'>
                {e.googleMapLink && <FaMapMarker />}
              </td>
              <td className='icon-cell'>{e.isPrivate && <FaCheckCircle />}</td>
              <td>
                <Button
                  size='sm'
                  variant='warning'
                  onClick={() => onEditClick(e._id)}
                >
                  Edit
                </Button>
                &nbsp;
                <Button
                  size='sm'
                  variant='danger'
                  onClick={() => onDeleteClick(e._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container className='AdminGigs'>
      <Row>
        <Col md={12}>
          <h1>Gigs</h1>
          {!show && !loading && renderGigsTable()}
          {show && renderEditor()}
        </Col>
      </Row>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Body>
          <div className='confirm-question'>
            <h3>Amy, are you sure you want to delete this event?</h3>
            <p>
              You&apos;ll never get it back again!{' '}
              <span role='img' aria-label='scream'>
                😱
              </span>
            </p>
          </div>
          <div className='button-container'>
            <Button size='sm' variant='danger' onClick={handleDelete}>
              Confirm and delete
            </Button>
            &nbsp;
            <Button size='sm' onClick={() => setShowConfirm(false)}>
              Abort
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminGigs;
