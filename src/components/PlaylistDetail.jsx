import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Modal,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';
import ContentWithControls from './ContentWithControls';
import styles from './styles';

function PlaylistDetail({ name, handleBackToPlaylists }) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const leftButtonStyle = { margin: '5px', width: '150px' };
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const playNow = (track) => {
    QueueClient.enqueueTop(track.path);
    QueueClient.play();
  };

  const loadTracks = (name) => {
    PlaylistClient.getPlaylist(name).then((playlist) => {
      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
      }
    });
  };

  const deleteTrack = (name, track) => {
    PlaylistClient.removeTracksFromPlaylist(name, [track]);
    loadTracks(name);
  };

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const leftButtonProps = {
    style: leftButtonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const renderTracks = [];

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  if (tracks) {
    tracks.forEach((track) => {
      renderTracks.push(
        (
          <ListGroupItem style={styles.cardStyle}>
            {track.name}
            <Button {...buttonProps} onClick={() => playNow(track)}>Play</Button>
            <Button {...buttonProps} onClick={() => QueueClient.enqueue(track)}>Enqueue</Button>
            <Button {...buttonProps} onClick={() => deleteTrack(name, track)}>Delete</Button>
          </ListGroupItem>
        ),
      );
    });
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
    PlaylistClient.delete(name).then(() => {
      handleBackToPlaylists();
    });
  };

  const controls = () => (
    <React.Fragment>
      <Button {...leftButtonProps} onClick={handleBackToPlaylists}>Back to Playlists</Button>
      <Button {...leftButtonProps}>Shuffle Playlist</Button>
      <Button {...leftButtonProps}>Save As...</Button>
      <Button {...leftButtonProps} onClick={() => setShowDeleteModal(true)}>Delete Playlist</Button>
    </React.Fragment>
  );

  const content = () => (<ListGroup>{renderTracks}</ListGroup>);
  return (
    <React.Fragment>
      <ContentWithControls
        alertText={`Playlist: ${name}`}
        controls={controls()}
        content={content()}
      />
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Playlist?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to delete the playlist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
          <Button variant="primary" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default PlaylistDetail;

PlaylistDetail.propTypes = {
  name: PropTypes.string,
  handleBackToPlaylists: PropTypes.func.isRequired,
};
PlaylistDetail.defaultProps = {
  name: '',
};
