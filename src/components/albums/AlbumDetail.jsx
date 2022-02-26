import React, { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import { Album } from '../shapes';
import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';
import AlbumCover from './AlbumCover';
import AlbumTracks from './AlbumTracks';
import { getAlbumTracks } from '../../lib/librarian-client';
import PlaylistsViewer from '../playlists/PlaylistsViewer';
import { SettingsContext } from '../layout/SettingsProvider';
import {
  getHeight,
  initListPaging,
  nextPage,
  previousPage,
} from '../../lib/pageHelper';
import styles from './AlbumDetail.module.css';

const propTypes = {
  album: Album.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumDetail({ album, clearCurrentAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [addTracks, setAddTracks] = useState();
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);
  const [paging, setPaging] = useState();
  const initialHeight = getHeight();

  const loadTracks = () => {
    if (!areTracksLoading) {
      getAlbumTracks(album.path).then((data) => {
        setPaging(initListPaging(data.length, 70, initialHeight));
        setTracks(data);
        setAreTracksLoaded(true);
        setAreTracksLoading(false);
      });
    }
  };

  const albumButtons = (
    <Container className={styles.buttonContainer}>
      <>
        <AlbumButtons
          album={album}
          clearCurrentAlbum={clearCurrentAlbum}
          tracks={tracks}
          setAddToPlaylist={setAddToPlaylist}
        />
        <AlbumAdminButtons album={album} />
      </>
    </Container>
  );

  const largeAlbum = () => {
    if (paging && !addToPlaylist && album) {
      return (
        <>
          <Row className={styles.coverRow}>
            <Col lg={3} xl={3}>
              <Container className={styles.albumContainer}>
                <>
                  <Row>
                    <AlbumCover album={album} />
                  </Row>
                  <Row className={styles.albumName}>
                    {album.name}
                  </Row>
                  <Row>{albumButtons}</Row>
                </>
              </Container>
            </Col>
            <Col lg={9} xl={9}>
              <AlbumTracks
                tracks={tracks.slice(paging.currentPage.start, paging.currentPage.limit)}
                nextPage={() => setPaging(nextPage(paging))}
                previousPage={() => setPaging(previousPage(paging))}
                paging={paging}
                showDownloadLink
                setAddToPlaylist={setAddToPlaylist}
                setAddTracks={setAddTracks}
              />
            </Col>
          </Row>
        </>
      );
    }

    return <PlaylistsViewer onAddComplete={() => {
      setAddToPlaylist(false);
      setAddTracks(null);
    }} mode="addToPlaylist" tracks={addTracks || tracks} />;
  };


  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0, 0);
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
