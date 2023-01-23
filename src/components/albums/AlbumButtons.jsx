import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListOl, PlayFill, PlusSquare } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import { enqueueTracks, enqueueTracksTop, next } from '../../lib/queue-client';
import { Tracks, Queue } from '../shapes';
import ControlButton from '../common/ControlButton';
import './AlbumButtons.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

const propTypes = {
  tracks: Tracks.isRequired,
  queue: Queue.isRequired,
  setQueue: PropTypes.func.isRequired,
};

const AlbumButtons = ({ tracks, queue, setQueue }) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const { state } = useLocation();
  const navigate = useNavigate();
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);
  const backText = () => <FormattedMessage id={state?.prevUrl.includes('tracks') ? 'back_to_tracks' : 'back_to_albums'} />;

  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const isAlbumInQueue = () => {
    let allTracksInQueue = queue?.tracks?.length > 0;

    if (tracks?.length > 0 && queue?.tracks?.length > 0) {
      tracks.map((track) => {
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
            {albumButton(playAlbum, <FormattedMessage id="play_album" />, settings.features.play)}
          </Row>
          <Row className="buttonRow">
            {albumButton(() => {
              applyLighting(settings, 'Enqueue');
              enqueueTracks(tracks);

              const clone = { ...queue };
              clone.tracks = [...clone.tracks, ...tracks];
              setQueue(clone);

              setTimeout(() => applyLighting(settings, 'Albums'), 700);
            }, <FormattedMessage id="enqueue_album" />, (settings.features.queue && !isAlbumInQueue()))}
            {albumButton(() => {
              navigate('/playlists', { state: { tracks } });
            }, <FormattedMessage id="add_to_playlist" />, settings.features.playlists)}
          </Row>
        </>
      )}
    </>
  );
};

AlbumButtons.propTypes = propTypes;

export default AlbumButtons;
