import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';

import { Album } from '../shapes';
import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';
import AlbumCover from './AlbumCover';
import AlbumTracks from './AlbumTracks';
import CoverArtSearchModal from './CoverArtSearchModal';
import { getAlbumTracks } from '../../lib/librarian-client';
import styles from './AlbumDetail.module.css';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  album: Album.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
};

const AlbumDetail = ({ clearCurrentAlbum }) => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const [tracks, setTracks] = useState([]);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const settings = useContext(SettingsContext);

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
  }, [isCustomSearchOpen])

  const albumButtons = (
    <Container className={styles.buttonContainer}>
      <>
        <AlbumButtons
          album={album}
          clearCurrentAlbum={clearCurrentAlbum}
          tracks={tracks}
        />
        <AlbumAdminButtons album={album} setIsCustomSearchOpen={setIsCustomSearchOpen} />
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
          <Row className={styles.coverRow}>
            <Col lg={3} xl={3}>
              <Container className={styles.albumContainer}>
                <>
                  <Row>
                    <AlbumCover album={album} />
                  </Row>
                  <Row className={styles.albumName} style={albumNameStyle}>
                    {album.name}
                  </Row>
                  <Row>{albumButtons}</Row>
                </>
              </Container>
            </Col>
            <Col lg={9} xl={9}>
              {!isCustomSearchOpen && <AlbumTracks tracks={tracks} />}
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
  };


  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0, 0);
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
