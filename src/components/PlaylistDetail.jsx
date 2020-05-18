import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';

function PlaylistDetail(props) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const playNow = (track) => {
    QueueClient.enqueueTop(track.path);
    QueueClient.play();
  };

  const enqueue = (track) => {
    QueueClient.enqueue(track);
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

  const cardStyle = {
    background: 'transparent',
    color: 'white',
    borderColor: '#708090',
  };

  const buttonStyle = {
    margin: '5px',
  };

  const renderTracks = [];
  const { name } = props;

  if (!isEmpty && !tracks.length) {
    console.log('here');
    loadTracks(name);
  }

  if (tracks) {
    tracks.forEach((track) => {
      renderTracks.push(
        (
          <ListGroupItem style={cardStyle}>
            {track.name}
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
              onClick={() => playNow(track)}
            >
              Play
            </Button>
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
              onClick={() => enqueue(track)}
            >
              Enqueue
            </Button>
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
              onClick={() => deleteTrack(name, track)}
            >
              Delete
            </Button>
          </ListGroupItem>
        ),
      );
    });
  }

  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          <ListGroup>
            {renderTracks}
          </ListGroup>
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
