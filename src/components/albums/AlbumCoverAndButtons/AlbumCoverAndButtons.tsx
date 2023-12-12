import { FC, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import AlbumAdminButtons from '../AlbumAdminButtons/AlbumAdminButtons';
import AlbumButtons from '../AlbumButtons/AlbumButtons';
import AlbumCover from '../AlbumCover/AlbumCover';
import { SettingsContext } from '../../layout/SettingsProvider';
import { IQueue, ITrack } from '../../interface';
import styles from './AlbumCoverAndButtons.module.css';

interface IAlbumCoverAndButtons {
  queue: IQueue,
  setQueue: Function,
  tracks: ITrack[],
  setIsCustomSearchOpen: Function,
  setIsConfirmRemoveCoverArtOpen: Function,
  setConfirmRestriction: Function,
  clickedTrack: ITrack | undefined,
}

const AlbumCoverAndButtons: FC<IAlbumCoverAndButtons> = ({ queue, setQueue, tracks, setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction, clickedTrack }) => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const settings = useContext(SettingsContext);
  const { screen } = settings;

  const albumButtons = (
    <div className={styles.buttonContainer}>
      <AlbumButtons
        queue={queue}
        setQueue={setQueue}
        tracks={tracks}
      />
      <AlbumAdminButtons
        setIsCustomSearchOpen={setIsCustomSearchOpen}
        setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
        setConfirmRestriction={setConfirmRestriction}
      />
    </div>
  );

  return screen?.isMobile ? (
    <div>
      <div className={styles.centeredRow}>
        <AlbumCover album={album} />
        {albumButtons}
      </div>
      <div className={styles.centeredRow}>
        {album.name}
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.albumContainer}>
        <div className={styles.centeredRow}>
          <AlbumCover album={album} />
        </div>
        <div className={styles.centeredRow}>
          {album.name}
        </div>
        {!clickedTrack && <div className={styles.centeredRow}>{albumButtons}</div>}
      </div>
    </div>
  );
};

export default AlbumCoverAndButtons;
