import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';

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

const propTypes = {
  clearCurrentAlbum: PropTypes.func.isRequired,
};

const AlbumDetail = ({ clearCurrentAlbum }) => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const [tracks, setTracks] = useState([]);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const [isConfirmRemoveCoverArtOpen, setIsConfirmRemoveCoverArtOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [confirmRestriction, setConfirmRestriction] = useState(false);
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

  const loadTracks = () => {
    if (!areTracksLoading) {
      getAlbumTracks(album.path).then((data) => {
        setTracks(data);
        setAreTracksLoaded(true);
        setAreTracksLoading(false);
      });
    }
  };

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
          album={album}
          clearCurrentAlbum={clearCurrentAlbum}
          tracks={tracks}
        />
        <AlbumAdminButtons
          album={album}
          setIsCustomSearchOpen={setIsCustomSearchOpen}
          setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
          setConfirmRestriction={setConfirmRestriction}
        />
      </>
    </Container>
  );

  const albumNameStyle = {
    color: settings.styles.fontColor,
    fontFamily: settings.styles.buttonFont,
  };

  const largeAlbum = () => {
    if (album) {
      return (
        <>
          <Row className="coverRow" style={{ marginTop: isScreenSmall ? '40px' : topMargin(settings) }}>
            <Col lg={3} xl={3}>
              <Container className="albumContainer">
                <>
                  <Row>
                    <AlbumCover album={album} />
                  </Row>
                  <Row className="albumName" style={albumNameStyle}>
                    {album.name}
                  </Row>
                  <Row>{albumButtons}</Row>
                </>
              </Container>
            </Col>
            <Col lg={9} xl={9}>
              {!isCustomSearchOpen && !isConfirmRemoveCoverArtOpen && (
                <AlbumTracks tracks={tracks} />
              )}
              {!isCustomSearchOpen && isConfirmRemoveCoverArtOpen && (
                <Confirm
                  text="Are you sure that you want to remove the cover?"
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
                  isOpen={isCustomSearchOpen}
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

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
