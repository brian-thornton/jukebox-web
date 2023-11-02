import Col from 'react-bootstrap/Col';
import { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import AlbumTracks from '../AlbumTracks/AlbumTracks';
import Confirm from '../../common/Confirm/Confirm';
import CoverArtSearchModal from '../CoverArtSearchModal/CoverArtSearchModal';
import { getAlbumTracks, removeCoverArt } from '../../../lib/service-clients/librarian-client';
import styles from './AlbumDetail.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';
import RestrictionModes from '../../settings/content/RestrictionModes/RestrictionModes';
import { topMargin } from '../../../lib/helper/styleHelper';
import { getQueue } from '../../../lib/service-clients/queue-client';
import AlbumCoverAndButtons from '../AlbumCoverAndButtons/AlbumCoverAndButtons';
import { ITrack } from '../../interface';
import TrackActions from '../../TrackActions';

const AlbumDetail = () => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const intl = useIntl();
  const [tracks, setTracks] = useState([]);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const [isConfirmRemoveCoverArtOpen, setIsConfirmRemoveCoverArtOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [confirmRestriction, setConfirmRestriction] = useState(false);
  const settings = useContext(SettingsContext);
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
        <Row className={styles.coverRow}>
          <AlbumCoverAndButtons
            queue={queue}
            setQueue={setQueue}
            tracks={tracks}
            setIsCustomSearchOpen={setIsCustomSearchOpen}
            setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
            setConfirmRestriction={setConfirmRestriction}
            clickedTrack={clickedTrack}
          />
          {clickedTrack && <TrackActions applyPadding={false} track={clickedTrack} onClose={() => setClickedTrack(undefined)} />}
          {!clickedTrack && (
            <Col lg={9} xl={9}>
              {!isCustomSearchOpen && !isConfirmRemoveCoverArtOpen && (
                <div style={{ marginTop: topMargin(settings) }}>
                  <AlbumTracks tracks={tracks} queue={queue} setQueue={setQueue} clickedTrack={clickedTrack} setClickedTrack={setClickedTrack} />
                </div>
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
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default AlbumDetail;
