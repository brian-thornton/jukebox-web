import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListOl, PlayFill, PlusSquare } from 'react-bootstrap-icons';

import Button from '../Button';
import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Tracks } from '../shapes';
import ControlButton from '../common/ControlButton';
import './AlbumButtons.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

const propTypes = {
  clearCurrentAlbum: PropTypes.func.isRequired,
  tracks: Tracks.isRequired,
};

const AlbumButtons = ({ tracks }) => {
  const isScreenSmall = window.innerWidth < 700;
  const settings = useContext(SettingsContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const albumButton = (onClick, name, enabled = true) => (
    <Col lg="12" xl="12" sm="12" xs="12" className="albumButton">
      <ControlButton disabled={!enabled} text={name} onClick={onClick} width="100%" height={buttonHeight} style={{ fontSize }} />
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
      {isScreenSmall && (
        <>
          <Row style={{ marginBottom: '0', paddingBottom: '0' }}>
            {settings.features.play && (
              <Button
                icon={<PlayFill />}
                onClick={playAlbum}
              />
            )}
            {settings.features.queue && <Button icon={<ListOl />} onClick={() => enqueueTracks(tracks)} />}
            {settings.features.playlists && <Button icon={<PlusSquare />} onClick={() => navigate('/playlists', { state: { tracks } })} />}
          </Row>
        </>
      )}
      {!isScreenSmall && (
        <>
          <Row>
            {albumButton(() => navigate(-1), backText())}
            {albumButton(playAlbum, 'Play Album', settings.features.play)}
          </Row>
          <Row>
            {albumButton(() => {
              applyLighting(settings, 'Enqueue');
              enqueueTracks(tracks);
              setTimeout(() => applyLighting(settings, 'Albums'), 700);
            }, 'Enqueue Album', settings.features.queue)}
            {albumButton(() => {
              navigate('/playlists', { state: { tracks } })
            }, 'Add to Playlist', settings.features.playlists)}
          </Row>
        </>
      )}
    </>
  );
}

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
