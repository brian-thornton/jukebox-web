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

  const renderTracks = [];
  const { tracks } = props;

  const buttonProps = {
    style: styles.buttonStyle,
    variant: "outline-light",
    className: "float-right",
  };

  tracks.forEach((track) => {
    if (track.id) {
      track.accessToken = window.accessToken;
    }

    renderTracks.push(
      (
        <ListGroupItem style={styles.cardStyle}>
          {track.name}
          <Button {...buttonProps} onClick={() => playNow(track)}>Play</Button>
          <Button {...buttonProps} onClick={() => QueueClient.enqueue(track)}>Enqueue</Button>
        </ListGroupItem>
      ),
    );
  });

  return (
    <ListGroup>{renderTracks}</ListGroup>
  );
}
export default TrackList;

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
