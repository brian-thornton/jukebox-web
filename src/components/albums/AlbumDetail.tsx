import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';
import AlbumCover from './AlbumCover';
import AlbumTracks from './AlbumTracks';
import Confirm from '../common/Confirm';
import CoverArtSearchModal from './CoverArtSearchModal';
import { getAlbumTracks, removeCoverArt } from '../../lib/librarian-client';
import './AlbumDetail.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import RestrictionModes from '../settings/content/RestrictionModes';
import { topMargin } from '../../lib/styleHelper';
import { getQueue } from '../../lib/queue-client';

const AlbumDetail = () => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const intl = useIntl();
  const [tracks, setTracks] = useState([]);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const [isConfirmRemoveCoverArtOpen, setIsConfirmRemoveCoverArtOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [confirmRestriction, setConfirmRestriction] = useState(false);
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const [queue, setQueue] = useState({tracks: [], totalTracks: 0});

  const loadTracks = () => {
    if (!areTracksLoading) {
      getAlbumTracks(album.path).then((data) => {
        setTracks(data);
        setAreTracksLoaded(true);
        setAreTracksLoading(false);
      });
    }
  };

  const loadQueue = () => {
    getQueue().then(data => setQueue(data));
  };

  useEffect(loadQueue, []);

  useEffect(() => {
    if (isCustomSearchOpen) {
      setReload(true);
    }

    if (!isCustomSearchOpen && reload) {
      window.location.reload();
    }
  }, [isCustomSearchOpen]);

  const albumButtons = (
    <Container className="buttonContainer">
      <>
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
      </>
    </Container>
  );

  const albumNameStyle = {
    color: settings?.styles?.fontColor,
    fontFamily: settings?.styles?.buttonFont,
  };

  const largeAlbum = () => {
    if (album) {
      return (
        <>
          <Row className="coverRow" style={{ marginTop: isScreenSmall ? '40px' : topMargin(settings) }}>
            <Col lg={3} xl={3}>
              <Container className="albumContainer">
                <Row>
                  <AlbumCover album={album} />
                </Row>
                <Row className="albumName" style={albumNameStyle}>
                  {album.name}
                </Row>
                <Row>{albumButtons}</Row>
              </Container>
            </Col>
            <Col lg={9} xl={9}>
              {!isCustomSearchOpen && !isConfirmRemoveCoverArtOpen && (
                <AlbumTracks tracks={tracks} queue={queue} setQueue={setQueue} />
              )}
              {!isCustomSearchOpen && isConfirmRemoveCoverArtOpen && (
                <Confirm
                  text={intl.formatMessage({id: 'remove_cover_text'})}
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
        </>
      );
    }

    return <></>;
  };


  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0, 0);
  }

  if (confirmRestriction) {
    return (
      <RestrictionModes
        addMode
        addComplete={() => setConfirmRestriction(false)}
        album={album}
      />
    );
  }

  return largeAlbum();
};

export default AlbumDetail;
