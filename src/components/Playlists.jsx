import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Col, Container, Row, Modal, InputGroup, FormControl,
} from 'react-bootstrap';
import PlaylistClient from '../lib/playlist-client';
import PlaylistDetail from './PlaylistDetail';
import styles from './styles';

function Playlists(props) {
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);

  const loadPlaylists = () => {
    PlaylistClient.getPlaylists().then((data) => {
      setPlaylists(data);
    });
  };

  if (!playlists.length) {
    loadPlaylists();
  }

  const handleClose = (data) => {
    if (data) {
      PlaylistClient.add({
        name: data,
        tracks: [],
      });
    }
    setShow(false);
    loadPlaylists();
  };

  const handleShow = () => setShow(true);

  const addTracksToPlaylist = (playlistName) => {
    const { tracks } = props;
    PlaylistClient.addTracksToPlaylist(playlistName, tracks);
  };

  const buttons = (playlistName) => {
    const { mode } = props;
    const buttonProps = {
      style: styles.buttonStyle,
      variant: 'outline-light',
      className: 'float-right',
    };

    const playlistActions = [];
    if (mode === 'addToPlaylist') {
      playlistActions.push((<Button {...buttonProps} onClick={() => addTracksToPlaylist(playlistName)}>Add</Button>));
    } else {
      playlistActions.push((<Button {...buttonProps}>Delete</Button>));
    }

    return playlistActions;
  };

  const selectPlaylist = (playlistName) => {
    setName(playlistName);
  };

  const { currentPlaylist } = props;
  const renderPlaylists = [];

  playlists.forEach((playlist) => {
    renderPlaylists.push(
      (
        <ListGroupItem
          onClick={() => selectPlaylist(playlist.name)}
          style={styles.cardStyle}
          key={playlist.name}
        >
          {playlist.name}
          {buttons(playlist.name)}
        </ListGroupItem>
      ),
    );
  });

  if (!currentPlaylist.name && !name) {
    return (
      <>
        <Container>
          <Row>
            <Col lg={12} xl={12}>
              <ListGroup>
                {renderPlaylists}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12} xl={12} />
          </Row>
          <Row>
            <Col lg={12} xl={12}>
              <Button
                variant="outline-light"
                className="float-right"
                onClick={handleShow}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                id="name"
                placeholder="Name"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleClose(document.getElementById('name').value)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  return (
    <PlaylistDetail name={name} />
  );
}

export default Playlists;

Playlists.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  mode: PropTypes.string,
  currentPlaylist: PropTypes.shape({
    name: PropTypes.string,
  }),
};

Playlists.defaultProps = {
  mode: '',
  currentPlaylist: {},
};
