import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Modal, InputGroup, FormControl,
} from 'react-bootstrap';
import PlaylistClient from '../lib/playlist-client';
import PlaylistDetail from './PlaylistDetail';
import styles from './styles';
import ContentWithControls from './ContentWithControls';

function Playlists(props) {
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const selectPlaylist = playlistName => setName(playlistName);
  const renderPlaylists = [];
  const alertText = 'Playlists';

  const handleBackToPlaylists = () => {
    setName('');
    loadPlaylists();
  }

  const loadPlaylists = () => {
    PlaylistClient.getPlaylists().then((data) => {
      setPlaylists(data);
    });
  };

  if (!playlists.length) {
    loadPlaylists();
  }

  const handleClose = (data) => {
    if ((typeof data) === 'string') {
      PlaylistClient.add({
        name: data,
        tracks: [],
      });
    }
    setShow(false);
    loadPlaylists();
  };

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
      playlistActions.push((
        <Button
          {...buttonProps}
          onClick={() => addTracksToPlaylist(playlistName)}
        >
          Add
        </Button>
      ));
    }

    return playlistActions;
  }

  const { currentPlaylist } = props;

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

  const buttonProps = {
    style: styles.settingsButtonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const controls = () => (
    <Button {...buttonProps} onClick={handleShow}>Add</Button>
  );

  const content = () => <ListGroup>{renderPlaylists}</ListGroup>;

  if (!currentPlaylist.name && !name) {
    return (
      <React.Fragment>
        <ContentWithControls content={content()} controls={controls()} alertText={alertText} />
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
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={() => handleClose(document.getElementById('name').value)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
  return (
    <PlaylistDetail name={name} handleBackToPlaylists={handleBackToPlaylists} />
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
