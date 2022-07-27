import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Tracks } from '../shapes';
import { toastProps } from '../common/toast-helper';
import ControlButton from '../common/ControlButton';
import styles from './AlbumButtons.module.css';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

const propTypes = {
  clearCurrentAlbum: PropTypes.func.isRequired,
  tracks: Tracks.isRequired,
};

const AlbumButtons = ({ tracks }) => {
  const settings = useContext(SettingsContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const albumButton = (onClick, name, enabled = true) => (
    <Col lg={6} className={styles.albumButton}>
      <ControlButton disabled={!enabled} text={name} onClick={onClick} height={50} />
    </Col>
  );

  const backText = () => {
    let text = 'Back to Albums';
    if (state?.prevUrl.includes('tracks')) {
      text = 'Back to Tracks';
    }

    return text;
  }

  return (
    <>
      <Row>
        {albumButton(() => navigate(-1), backText())}
        {albumButton(playAlbum, 'Play Album', settings.features.play)}
      </Row>
      <Row>
        {albumButton(() => {
          applyLighting(settings, 'Enqueue');
          enqueueTracks(tracks);
          toast.success("Added to the queue!", toastProps);
          setTimeout(() => applyLighting(settings, 'Albums'), 700);
        }, 'Enqueue Album', settings.features.queue)}
        {albumButton(() => {
          navigate('/playlists', { state: { tracks } })
        }, 'Add to Playlist', settings.features.playlists)}
      </Row>
    </>
  );
}

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
