import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import QueueClient from '../lib/queue-client';
import { Settings, Tracks } from './shapes';

const propTypes = {
  setAddToPlaylist: PropTypes.func.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
  tracks: Tracks.isRequired,
};

function AlbumButtons({
  clearCurrentAlbum,
  settings,
  tracks,
  setAddToPlaylist,
}) {
  const enqueueAlbum = () => QueueClient.enqueueTracks(tracks);

  const playAlbum = () => {
    QueueClient.enqueueTracksTop(tracks);
    QueueClient.next();
  };

  const props = {
    block: true,
    variant: 'outline-light',
    style: {
      background: settings.styles.buttonBackgroundColor,
      color: settings.styles.fontColor,
    },
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} style={{ padding: '0px' }}>
          <Button {...props} onClick={clearCurrentAlbum}>Back to Albums</Button>
        </Col>
        <Col lg={6} style={{ padding: '0px' }}>
          <Button {...props} onClick={playAlbum}>Play Album</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={6} style={{ padding: '0px' }}>
          <Button {...props} onClick={enqueueAlbum}>Enqueue Album</Button>
        </Col>
        <Col lg={6} style={{ padding: '0px' }}>
          <Button {...props} onClick={() => setAddToPlaylist(true)}>Add to Playlist</Button>
        </Col>
      </Row>
    </React.Fragment>
  );
}

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
