import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Container,
  Table,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import './AdminVideos.scss';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [idToDelete, setIdToDelete] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/videos/get`
      );
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSave = async () => {
    const hasId = !!idToEdit;
    const video = {
      title,
      description,
      url,
      imageUrl,
      orderIndex,
      isLive,
    };
    if (hasId) video.id = idToEdit;

    const uri = hasId
      ? `${process.env.REACT_APP_API_URL}/videos/patch/${idToEdit}`
      : `${process.env.REACT_APP_API_URL}/videos/post`;
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    try {
      const response = await fetch(uri, {
        method: hasId ? 'PATCH' : 'POST',
        body: JSON.stringify(video),
        headers,
      });

      if (response.ok) {
        await refreshData();
        setShow(false);
      } else {
        console.error('Failed to save event:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = () => {
    const url = `${process.env.REACT_APP_API_URL}/videos/delete/${idToDelete}`;
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    fetch(url, { method: 'DELETE', headers }).then(() => {
      refreshData();
      setShowConfirm(false);
    });
  };

  const onAddNew = () => {
    setIdToEdit('');
    setShow(true);
    setTitle('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    setOrderIndex(5);
    setIsLive(false);
  };

  const onEditClick = (id) => {
    const video = videos.find((e) => e._id === id);
    setIdToEdit(id);
    setShow(true);
    setTitle(video.title || '');
    setDescription(video.description || '');
    setUrl(video.url || '');
    setImageUrl(video.imageUrl || '');
    setOrderIndex(video.orderIndex || '');
    setIsLive(video.isLive);
  };

  const onDeleteClick = (id) => {
    setIdToDelete(id);
    setShowConfirm(true);
  };

  const renderEditor = () => (
    <Row className='editor'>
      <Col md={6}>
        <Form>
          <Form.Group controlId='formTitle'>
            <Form.Label>Enter video title</Form.Label>
            <Form.Control
              type='text'
              value={title}
              placeholder='Enter the video title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formDescription'>
            <Form.Label>Enter description</Form.Label>
            <Form.Control
              type='text'
              value={description}
              placeholder='Enter the description'
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formVideoUrl'>
            <Form.Label>Enter YouTube URL</Form.Label>
            <Form.Control
              type='text'
              value={url}
              placeholder='https://www.youtube.com/?n=yaddayadda'
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formImageUrl'>
            <Form.Label>Enter YouTube Image URL</Form.Label>
            <Form.Control
              type='text'
              value={imageUrl}
              placeholder='https://i.ytimg.com/yaddayadda'
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formOrderIndex'>
            <Form.Label>Enter Order Index</Form.Label>
            <Form.Control
              type='number'
              value={orderIndex}
              placeholder='100'
              onChange={(e) => setOrderIndex(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formIsLive'>
            <Form.Check
              type='checkbox'
              label='Is live (visible)?'
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
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

  const renderVideosTable = () => (
    <div className='AdminVideos'>
      <div className='button-container'>
        <Button variant='success' onClick={onAddNew}>
          Add a new video
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Is Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.description}</td>
              <td>{e.isLive ? 'Yes' : 'No'}</td>
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
    <Container className='AdminVideos'>
      <Row>
        <Col md={12}>
          <h1>Videos</h1>
          {!show && !loading && renderVideosTable()}
          {show && renderEditor()}
        </Col>
      </Row>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Body>
          <div className='confirm-question'>
            <h3>Amy, are you sure you want to delete this video?</h3>
            <p>
              You could flip the &apos;Is Visible&apos; setting to stop it
              appearing on your site.{' '}
              <span role='img' aria-label='smiley'>
                😉
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

export default AdminVideos;
