import React from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Image,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import styles from './styles';

function TrackList(props) {
  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.next();
  };

  const enqueue = (track) => {
    QueueClient.enqueue(track);
  };

  const renderTracks = [];
  const { tracks } = props;
  tracks.forEach((track) => {
    if (track.id) {
      track.accessToken = window.accessToken;
    }

    renderTracks.push(
      (
        <ListGroupItem style={styles.cardStyle}>
          {track.name}
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
            onClick={() => playNow(track)}
          >
            Play
          </Button>
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
            onClick={() => enqueue(track)}
          >
            Enqueue
          </Button>
        </ListGroupItem>
      ),
    );
  });

  return (
    <ListGroup>
      {renderTracks}
    </ListGroup>
  );
}
export default TrackList;

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
