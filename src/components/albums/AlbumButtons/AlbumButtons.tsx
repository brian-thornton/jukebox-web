import { FC, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusSquare } from 'react-bootstrap-icons';
import { useIntl } from 'react-intl';

import Button from '../../common/Buttons/Button/Button';
import { enqueueTracks, enqueueTracksTop, next } from '../../../lib/service-clients/queue-client';
import { ITrack, IQueue } from '../../interface';
import ControlButton from '../../common/Buttons/ControlButton/ControlButton';
import styles from './AlbumButtons.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';
import { applyLighting } from '../../../lib/helper/lightingHelper';
import { isAlbumInQueue } from '../../../lib/helper/album-helper';
import PlayButton from '../../../components/common/Buttons/PlayButton/PlayButton';
import EnqueueButton from '../../../components/common/Buttons/EnqueueButton/EnqueueButton';

interface IAlbumButtons {
  tracks: Array<ITrack>,
  queue: IQueue,
  setQueue: Function,
}

const AlbumButtons: FC<IAlbumButtons> = ({ tracks, queue, setQueue }) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings?.styles || {};
  const intl = useIntl();
  const { features } = settings || {};
  const { state } = useLocation();
  const navigate = useNavigate();
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const backText = () => intl.formatMessage({ id: state?.prevUrl.includes('tracks') ? 'back_to_tracks' : 'back_to_albums' });

  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  const albumButton = (onClick: Function, name: string, enabled = true) => (
    <div className={styles.albumButton}>
      <ControlButton
        disabled={!enabled}
        text={name}
        onClick={onClick}
        width="100%"
        height={buttonHeight}
      />
    </div>
  );

  return (
    <>
      <div className={styles.mobile}>
        <PlayButton tracks={tracks} />
        <EnqueueButton tracks={tracks} />
        {features?.playlists && (
          <Button
            icon={<PlusSquare />}
            onClick={() => navigate('/playlists', { state: { tracks } })}
          />
        )}
      </div>
      <div className={styles.buttonRow}>
        {albumButton(() => navigate(-1), backText())}
        {albumButton(playAlbum, intl.formatMessage({ id: 'play_album' }), features?.play)}
        {albumButton(() => {
          applyLighting(settings, 'Enqueue');
          enqueueTracks(tracks);

          const clone = { ...queue };

          // @ts-ignore
          clone.tracks = [...clone.tracks, ...tracks];
          setQueue(clone);

          setTimeout(() => applyLighting(settings, 'Albums'), 700);
        }, intl.formatMessage({ id: 'enqueue_album' }), (features?.queue && !isAlbumInQueue(queue, tracks)))}
        {albumButton(() => {
          navigate('/playlists', { state: { tracks } });
        }, intl.formatMessage({ id: 'add_to_playlist' }), features?.playlists)}
      </div>
    </>
  );
};

export default AlbumButtons;
