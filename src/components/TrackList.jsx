import React from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Image,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import styles from './styles';
import LibrianClient from '../lib/librarian-client';

function TrackList({ tracks, settings }) {
  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.next();
  };

  const renderTracks = [];

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const handleDownload = (track) => {
    LibrianClient.downloadTrack(track).then(response => {
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = track.name;
        a.click();
      })
    })
  }

  const link = (track) => {
    if (settings.features.admin) {
      return <div style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline'}}><a onClick={() => handleDownload(track)}>Download</a></div>;
    }

    return <React.Fragment />;
  }


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
          {link(track)}
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
