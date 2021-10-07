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
import AlbumTracks from '../AlbumTracks';
import { getAlbumTracks } from '../../lib/librarian-client';
import Playlists from '../playlists/Playlists';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from '../styles';
import {
  getHeight,
  initHorizontalPaging,
  nextPage,
  previousPage,
} from '../../lib/pageHelper';

const propTypes = {
  album: Album.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumDetail({ album, clearCurrentAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);
  const [paging, setPaging] = useState();
  const initialHeight = getHeight();
  const settings = useContext(SettingsContext);

  const loadTracks = () => {
    if (!areTracksLoading) {
      getAlbumTracks(album.path).then((data) => {
        setPaging(initHorizontalPaging(data.length, 150, initialHeight, 650));
        setTracks(data);
        setAreTracksLoaded(true);
        setAreTracksLoading(false);
      });
    }
  };

  const albumButtons = (
    <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
      <AlbumButtons
        album={album}
        clearCurrentAlbum={clearCurrentAlbum}
        tracks={tracks}
        setAddToPlaylist={setAddToPlaylist}
      />
      <AlbumAdminButtons album={album} />
    </Container>
  );

  const largeAlbum = () => {
    if (paging && !addToPlaylist && album) {
      return (
        <>
          <Row style={{ marginTop: '70px' }}>
            <Col lg={3} xl={3}>
              <Card style={styles.albumCardLarge} className="h-55 w-85">
                <AlbumCover album={album} />
                <Card.Body>
                  <Card.Title style={{ maxHeight: '25px', fontSize: '15px', fontFamily: settings.styles.listFont }}>{album.name}</Card.Title>
                </Card.Body>
                {albumButtons}
              </Card>
            </Col>
            <Col lg={9} xl={9}>
              <AlbumTracks
                tracks={tracks.slice(paging.currentPage.start, paging.currentPage.limit)}
                nextPage={() => setPaging(nextPage(paging))}
                previousPage={() => setPaging(previousPage(paging))}
                paging={paging}
                showDownloadLink
              />
            </Col>
          </Row>
        </>
      );
    }

    return <Playlists mode="addToPlaylist" tracks={tracks} />;
  };


  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0, 0);
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
