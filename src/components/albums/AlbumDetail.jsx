import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import LibrianClient from '../../lib/librarian-client';
import AlbumTracks from '../AlbumTracks';
import Playlists from '../playlists/Playlists';
import styles from '../styles';
import { Album, Settings } from '../shapes';
import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';
import AlbumCover from './AlbumCover';

const propTypes = {
  album: Album.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function AlbumDetail({ album, clearCurrentAlbum, settings }) {
  const [tracks, setTracks] = useState([]);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);

  const loadTracks = () => {
    if (!areTracksLoading) {
      LibrianClient.getAlbumTracks(album.path).then((data) => {
        setTracks(data);
        setAreTracksLoaded(true);
        setAreTracksLoading(false);
      });
    }
  };

  const albumButtons = (
    <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
      <AlbumButtons album={album} clearCurrentAlbum={clearCurrentAlbum} settings={settings} tracks={tracks} setAddToPlaylist={setAddToPlaylist} />
      <AlbumAdminButtons album={album} settings={settings} />
    </Container>
  );

  const largeAlbum = () => {
    if (!addToPlaylist) {
      return (
        <React.Fragment>
          <Row style={{ marginTop: '70px' }}>
            <Col lg={3} xl={3}>
              <Card style={styles.albumCardLarge} className="h-55 w-85">
                <AlbumCover album={album} />
                <Card.Body>
                  <Card.Title style={{ maxHeight: '25px', fontSize: '15px' }}>{album.name}</Card.Title>
                </Card.Body>
                {albumButtons}
              </Card>
            </Col>
            <Col lg={9} xl={9}>
              <AlbumTracks tracks={tracks} settings={settings} showDownloadLink />
            </Col>
          </Row>
        </React.Fragment>
      );
    }

    return (<Playlists mode="addToPlaylist" tracks={tracks} settings={settings} />);
  };


  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0, 0);
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
