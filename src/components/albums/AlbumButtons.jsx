import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Settings, Tracks } from '../shapes';
import { controlButtonProps } from '../../lib/styleHelper';
import './AlbumButtons.css';

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
  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const albumButton = (onClick, name) => (
    <Col lg={6} style={{ padding: '0px' }}>
      <Button {...controlButtonProps(settings)} onClick={onClick}>{name}</Button>
    </Col>
  );

  return (
    <React.Fragment>
      <Row>
        {albumButton(clearCurrentAlbum, 'Back to Albums')}
        {albumButton(playAlbum, 'Play Album')}
      </Row>
      <Row>
        {albumButton(() => enqueueTracks(tracks), 'Enqueue Album')}
        {albumButton(() => setAddToPlaylist(true), 'Add to Playlist')}
      </Row>
    </React.Fragment>
  );
}

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
