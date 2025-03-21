import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Container,
  Table,
  Button,
  Modal,
  FormControl,
  FormGroup,
  FormLabel,
  FormCheck,
} from 'react-bootstrap';
import Datetime from 'react-datetime';
import * as validator from 'validator';
import moment from 'moment';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './react-datetime.css';
import './AdminBlogPosts.scss';

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [edit, setEdit] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [datePublished, setDatePublished] = useState(moment());
  const [pageTitle, setPageTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isPageTitleValid, setIsPageTitleValid] = useState(true);
  const [isSlugValid, setIsSlugValid] = useState(true);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [type, setType] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/blogposts/get`
    );
    const data = await response.json();
    setPosts(data);
  };

  const handleSave = async () => {
    const hasId = !!idToEdit;
    if (isPageTitleValid && isSlugValid) {
      const postData = {
        pageTitle,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        datePublished: moment(datePublished).format('YYYY-MM-DD H:mm'),
        isLive,
        slug,
        type,
        ...(hasId && { id: idToEdit }),
      };

      await fetch(
        hasId
          ? `${process.env.REACT_APP_API_URL}/blogposts/patch/${idToEdit}`
          : `${process.env.REACT_APP_API_URL}/blogposts/post`,
        {
          method: hasId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        }
      );

      fetchPosts();
      setEdit(false);
    }
  };

  const handleDelete = async () => {
    await fetch(
      `${process.env.REACT_APP_API_URL}/blogposts/delete/${idToDelete}`,
      { method: 'DELETE' }
    );
    fetchPosts();
    setShowConfirm(false);
  };

  const handleEdit = (postId) => {
    const post = posts.find((p) => p._id === postId);
    setIdToEdit(postId);
    setEdit(true);
    setPageTitle(post.pageTitle);
    setEditorState(EditorState.createWithContent(stateFromHTML(post.body)));
    setDatePublished(moment(post.datePublished));
    setIsLive(post.isLive);
    setSlug(post.slug);
    setType(post.type);
  };

  const handlePageTitleChange = (e) => {
    const title = e.target.value.trimStart();
    const generatedSlug = title.replace(/\s+/g, '-').toLowerCase();
    setPageTitle(title);
    setSlug(generatedSlug);
    setIsPageTitleValid(validator.isLength(title, { min: 3, max: 50 }));
    setIsSlugValid(validator.isLength(generatedSlug, { min: 3, max: 50 }));
  };

  return (
    <Container className='AdminBlogPosts'>
      <Row>
        <Col md={12}>
          <h1>News</h1>
          {!edit ? (
            <div className='overview'>
              <Button
                variant='success'
                onClick={() => {
                  setEdit(true);
                  setIdToEdit('');
                  setEditorState(EditorState.createEmpty());
                  setPageTitle('');
                  setIsLive(false);
                  setSlug('');
                }}
              >
                Add a new post
              </Button>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Published Date</th>
                    <th>Heading</th>
                    <th>Slug</th>
                    <th>IsLive</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {moment(p.datePublished).format('DD/MM/YYYY, h:mm a')}
                      </td>
                      <td>{p.pageTitle}</td>
                      <td>{p.slug}</td>
                      <td>{p.isLive ? '✔️' : ''}</td>
                      <td>
                        <Button
                          size='sm'
                          variant='warning'
                          onClick={() => handleEdit(p._id)}
                        >
                          Edit
                        </Button>
                        &nbsp;
                        <Button
                          size='sm'
                          variant='danger'
                          onClick={() => {
                            setShowConfirm(true);
                            setIdToDelete(p._id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className='edit-blog'>
              <Row>
                <Col sm={9}>
                  <FormGroup className='form-group'>
                    <FormLabel>Enter title</FormLabel>
                    <FormControl
                      type='text'
                      value={pageTitle}
                      placeholder='Enter the title'
                      onChange={handlePageTitleChange}
                    />
                  </FormGroup>
                  <Editor
                    editorState={editorState}
                    wrapperClassName='wrapper'
                    editorClassName='editor'
                    onEditorStateChange={setEditorState}
                  />
                </Col>
                <Col sm={3}>
                  <FormGroup className='form-group'>
                    <FormLabel>Enter publish date</FormLabel>
                    <Datetime
                      value={datePublished}
                      onChange={setDatePublished}
                      closeOnTab
                      closeOnSelect
                    />
                  </FormGroup>
                  <FormCheck
                    label='Is live?'
                    checked={isLive}
                    onChange={(e) => setIsLive(e.target.checked)}
                  />
                  <div className='button-container'>
                    <Button onClick={() => setEdit(false)}>Cancel</Button>
                    &nbsp;
                    <Button variant='warning' onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Body>
          <h3>Are you sure you want to delete this post?</h3>
          <Button variant='danger' onClick={handleDelete}>
            Confirm and delete
          </Button>
          &nbsp;
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminBlogPosts;
