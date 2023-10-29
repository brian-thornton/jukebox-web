import Col from 'react-bootstrap/Col';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListOl, PlayFill, PlusSquare } from 'react-bootstrap-icons';
import { useIntl } from 'react-intl';

import Button from '../../Button';
import { enqueueTracks, enqueueTracksTop, next } from '../../../lib/service-clients/queue-client';
import { ITrack, IQueue } from '../../interface';
import ControlButton from '../../common/ControlButton/ControlButton';
import './AlbumButtons.scss';
import { SettingsContext } from '../../layout/SettingsProvider';
import { applyLighting } from '../../../lib/helper/lightingHelper';

interface IAlbumButtons {
  tracks: Array<ITrack>,
  queue: IQueue,
  setQueue: Function,
}

const AlbumButtons: FC<IAlbumButtons> = ({ tracks, queue, setQueue }) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings?.styles || {};
  const intl = useIntl();
  const { features, isScreenSmall } = settings || {};
  const { state } = useLocation();
  const navigate = useNavigate();
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);
  const backText = () => intl.formatMessage({ id: state?.prevUrl.includes('tracks') ? 'back_to_tracks' : 'back_to_albums' });

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

  const albumButton = (onClick: Function, name: string, enabled = true) => (
    <Col lg={colLayout ? '6' : '12'} xl={colLayout ? '6' : '12'} sm="12" xs="12" className="albumButton">
      <ControlButton
        disabled={!enabled}
        text={name}
        onClick={onClick}
        width="100%"
        height={buttonHeight}
        style={{ fontSize }}
      />
    </Col>
  );

  return (
    <>
      {isScreenSmall && (
        <>
          <Row className="centeredRow">
            {features?.play && (
              <Button
                icon={<PlayFill />}
                onClick={playAlbum}
              />
            )}
            {features?.queue && (
              <Button
                icon={<ListOl />}
                onClick={() => enqueueTracks(tracks)}
              />
            )}
            {features?.playlists && (
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
            {albumButton(playAlbum, intl.formatMessage({ id: 'play_album' }), features?.play)}
          </Row>
          <Row className="buttonRow">
            {albumButton(() => {
              applyLighting(settings, 'Enqueue');
              enqueueTracks(tracks);

              const clone = { ...queue };

              // @ts-ignore
              clone.tracks = [...clone.tracks, ...tracks];
              setQueue(clone);

              setTimeout(() => applyLighting(settings, 'Albums'), 700);
            }, intl.formatMessage({ id: 'enqueue_album' }), (features?.queue && !isAlbumInQueue()))}
            {albumButton(() => {
              navigate('/playlists', { state: { tracks } });
            }, intl.formatMessage({ id: 'add_to_playlist' }), features?.playlists)}
          </Row>
        </>
      )}
    </>
  );
};

export default AlbumButtons;
