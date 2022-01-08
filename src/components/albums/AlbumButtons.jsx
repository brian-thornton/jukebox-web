import React from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col } from 'react-bootstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Tracks } from '../shapes';
import { toastProps } from '../common/toast-helper';
import ControlButton from '../common/ControlButton';

import './AlbumButtons.css';

const propTypes = {
  setAddToPlaylist: PropTypes.func.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
  tracks: Tracks.isRequired,
};

function AlbumButtons({
  clearCurrentAlbum,
  tracks,
  setAddToPlaylist,
}) {
  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const albumButton = (onClick, name) => (
    <Col lg={6} style={{ padding: '0px' }}>
      <ControlButton text={name} onClick={onClick} height={50} />
    </Col>
  );

  return (
    <>
      <Row>
        {albumButton(clearCurrentAlbum, 'Back to Albums')}
        {albumButton(playAlbum, 'Play Album')}
      </Row>
      <Row>
        {albumButton(() => {
          enqueueTracks(tracks);
          toast.success("Added to the queue!", toastProps);
        }, 'Enqueue Album')}
        {albumButton(() => setAddToPlaylist(true), 'Add to Playlist')}
      </Row>
    </>
  );
}

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
