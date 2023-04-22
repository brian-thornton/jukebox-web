import Col from 'react-bootstrap/Col';
import { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import AlbumTracks from './AlbumTracks';
import Confirm from '../common/Confirm';
import CoverArtSearchModal from './CoverArtSearchModal';
import { getAlbumTracks, removeCoverArt } from '../../lib/librarian-client';
import './AlbumDetail.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import RestrictionModes from '../settings/content/RestrictionModes';
import { topMargin } from '../../lib/styleHelper';
import { getQueue } from '../../lib/queue-client';
import AlbumCoverAndButtons from './AlbumCoverAndButtons';

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
  const { isScreenSmall } = settings;
  const [queue, setQueue] = useState({ tracks: [], totalTracks: 0 });

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
        <Row className="coverRow" style={{ marginTop: isScreenSmall ? '40px' : topMargin(settings) }}>
          <AlbumCoverAndButtons
            queue={queue}
            setQueue={setQueue}
            tracks={tracks}
            setIsCustomSearchOpen={setIsCustomSearchOpen}
            setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
            setConfirmRestriction={setConfirmRestriction}
          />
          <Col lg={9} xl={9}>
            {!isCustomSearchOpen && !isConfirmRemoveCoverArtOpen && (
              <AlbumTracks tracks={tracks} queue={queue} setQueue={setQueue} />
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
        </Row>
      )}
    </>
  );
};

export default AlbumDetail;
