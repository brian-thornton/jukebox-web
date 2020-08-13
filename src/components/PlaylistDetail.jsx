import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert, ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';
import styles from './styles';

function PlaylistDetail({ name, handleBackToPlaylists }) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const leftButtonStyle = { margin: '5px', width: '150px' };

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

  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          <Alert variant="primary">{`Playlist: ${name}`}</Alert>
        </Col>
      </Row>
      <Row>
        <Col lg={2} xl={2}>
          <Button {...leftButtonProps} onClick={handleBackToPlaylists}>Back to Playlists</Button>
          <Button {...leftButtonProps}>Shuffle Playlist</Button>
          <Button {...leftButtonProps}>Save As...</Button>
          <Button {...leftButtonProps}>Delete Playlist</Button>
        </Col>
        <Col lg={10} xl={10}>
          <ListGroup>{renderTracks}</ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default PlaylistDetail;

PlaylistDetail.propTypes = {
  name: PropTypes.string,
};
PlaylistDetail.defaultProps = {
  name: '',
};
