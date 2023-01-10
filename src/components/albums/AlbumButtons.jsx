import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListOl, PlayFill, PlusSquare } from 'react-bootstrap-icons';
import { injectIntl } from 'react-intl';

import Button from '../Button';
import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Tracks } from '../shapes';
import ControlButton from '../common/ControlButton';
import './AlbumButtons.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

const propTypes = {
  tracks: Tracks.isRequired,
};

const AlbumButtons = ({ intl, tracks, queue, setQueue }) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const { state } = useLocation();
  const navigate = useNavigate();
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);
  const backText = () => state?.prevUrl.includes('tracks') ? intl.formatMessage({ id: 'back_to_tracks'}) : intl.formatMessage({ id: 'back_to_albums'});

  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const isAlbumInQueue = () => {
    let allTracksInQueue = queue?.tracks?.length > 0;

    if (tracks?.length > 0 && queue?.tracks?.length > 0) {
      tracks.map(track => {
        if (!queue.tracks.find(t => t.path === track.path)) {
          allTracksInQueue = false;
        }
      });
    }

    return allTracksInQueue;
  };

  const albumButton = (onClick, name, enabled = true) => (
    <Col lg={colLayout ? '6' : '12'} xl={colLayout ? '6' : '12'} sm="12" xs="12" className="albumButton">
      <ControlButton
        disabled={!enabled}
        text={name}
        onClick={onClick}
        width="100%"
        height={buttonHeight}
        style={{ fontSize, marginTop: '0px', marginBottom: '0px' }}
      />
    </Col>
  );

  return (
    <>
      {isScreenSmall && (
        <>
          <Row className="buttonRow">
            {settings.features.play && (
              <Button
                icon={<PlayFill />}
                onClick={playAlbum}
              />
            )}
            {settings.features.queue && (
              <Button
                icon={<ListOl />}
                onClick={() => enqueueTracks(tracks)}
              />
            )}
            {settings.features.playlists && (
              <Button
                icon={<PlusSquare />}
                onClick={() => navigate('/playlists', { state: { tracks } })}
              />
            )}
          </Row>
        </>
      )}
      {!isScreenSmall && (
        <>
          <Row className="buttonRow">
            {albumButton(() => navigate(-1), backText())}
            {albumButton(playAlbum, intl.formatMessage({id: 'play_album'}), settings.features.play)}
          </Row>
          <Row className="buttonRow">
            {albumButton(() => {
              applyLighting(settings, 'Enqueue');
              enqueueTracks(tracks);

              const clone = { ...queue };
              clone.tracks = [...clone.tracks, ...tracks];
              setQueue(clone);

              setTimeout(() => applyLighting(settings, 'Albums'), 700);
            }, intl.formatMessage({id: 'enqueue_album'}), (settings.features.queue && !isAlbumInQueue()))}
            {albumButton(() => {
              navigate('/playlists', { state: { tracks } });
            }, intl.formatMessage({id: 'add_to_playlist'}), settings.features.playlists)}
          </Row>
        </>
      )}
    </>
  );
};

AlbumButtons.propTypes = propTypes;

export default injectIntl(AlbumButtons);
