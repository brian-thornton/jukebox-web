import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import AlbumTracks from '../AlbumTracks/AlbumTracks';
import Confirm from '../../common/Confirm/Confirm';
import CoverArtSearchModal from '../CoverArtSearchModal/CoverArtSearchModal';
import { getAlbumTracks, removeCoverArt } from '../../../lib/service-clients/librarian-client';
import styles from './AlbumDetail.module.css';
import RestrictionModes from '../../settings/content/RestrictionModes/RestrictionModes';
import { getQueue } from '../../../lib/service-clients/queue-client';
import AlbumCoverAndButtons from '../AlbumCoverAndButtons/AlbumCoverAndButtons';
import { ITrack } from '../../interface';
import TrackActions from '../TrackActions';

const AlbumDetail = () => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const intl = useIntl();
  const [tracks, setTracks] = useState([]);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const [isConfirmRemoveCoverArtOpen, setIsConfirmRemoveCoverArtOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [confirmRestriction, setConfirmRestriction] = useState(false);
  const [queue, setQueue] = useState({ tracks: [], totalTracks: 0 });
  const [clickedTrack, setClickedTrack] = useState<ITrack | undefined>(undefined);

  const loadTracks = () => {
    getAlbumTracks(album.path).then((data) => {
      setTracks(data);
    });
  };

  const loadQueue = () => {
    getQueue().then(data => setQueue(data));
  };

  useEffect(() => {
    loadTracks();
    loadQueue();
  }, []);

  useEffect(() => {
    if (isCustomSearchOpen) {
      setReload(true);
    }

    if (!isCustomSearchOpen && reload) {
      window.location.reload();
    }
  }, [isCustomSearchOpen]);

  if (confirmRestriction) {
    return (
      <RestrictionModes
        addMode
        addComplete={() => setConfirmRestriction(false)}
        album={album}
      />
    );
  }

  return (
    <>
      {album && (
        <div className={styles.coverRow}>
          <AlbumCoverAndButtons
            queue={queue}
            setQueue={setQueue}
            tracks={tracks}
            setIsCustomSearchOpen={setIsCustomSearchOpen}
            setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
            setConfirmRestriction={setConfirmRestriction}
            clickedTrack={clickedTrack}
          />
          {clickedTrack && <TrackActions track={clickedTrack} onClose={() => setClickedTrack(undefined)} />}
          {!clickedTrack && (
            <div className={styles.albumTracks}>
              {!isCustomSearchOpen && !isConfirmRemoveCoverArtOpen && (
                // <div className={styles.albumTracks}>
                  <AlbumTracks
                    clickedTrack={clickedTrack}
                    queue={queue}
                    setClickedTrack={setClickedTrack}
                    setQueue={setQueue}
                    tracks={tracks}
                  />
                // </div>
              )}
              {!isCustomSearchOpen && isConfirmRemoveCoverArtOpen && (
                <Confirm
                  text={intl.formatMessage({ id: 'remove_cover_text' })}
                  onCancel={() => setIsConfirmRemoveCoverArtOpen(false)}
                  onConfirm={() => {
                    removeCoverArt(album);
                    setIsConfirmRemoveCoverArtOpen(false);
                    window.location.reload();
                  }}
                />
              )}
              {isCustomSearchOpen && (
                <CoverArtSearchModal
                  album={album}
                  handleClose={() => setIsCustomSearchOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AlbumDetail;
