import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import LibrianClient from '../lib/librarian-client';
import defaultCover from '../default_album.jpg';
import AlbumTracks from './AlbumTracks';
import Playlists from './Playlists';
import styles from './styles';
import SpotifyClient from '../lib/spotify-client';
import { Album, Settings } from './shapes';
import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';

const albumArt = require('album-art');

const propTypes = {
  album: Album.isRequired,
  clearCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function AlbumDetail({ album, clearCurrentAlbum, settings }) {
  const [coverArt, setCoverArt] = useState('');
  const [tracks, setTracks] = useState([]);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isCoverArtLoaded, setIsCoverArtLoaded] = useState(false);
  const [isCoverArtLoading, setIsCoverArtLoading] = useState(false);
  const [areTracksLoading, setAreTracksLoading] = useState(false);
  const [areTracksLoaded, setAreTracksLoaded] = useState(false);

  const getCoverArt = () => {
    const nameArray = album.name.split('-');

    albumArt(nameArray[0], { album: nameArray[1] }).then((data) => {
      if (data.toString().includes('http')) {
        setCoverArt(data);
      } else {
        setCoverArt(defaultCover);
      }
    });
  };

  const loadCoverArt = () => {
    if (!isCoverArtLoading) {
      setIsCoverArtLoading(true);
      LibrianClient.getCoverArt(album.path).then((image) => {
        let src;
        if (album.id) {
          src = album.images[1].url;
        } else if (image.type === 'image/jpeg') {
          src = URL.createObjectURL(image);
        } else {
          getCoverArt();
        }
        setIsCoverArtLoading(false);
        setIsCoverArtLoaded(true);
        setCoverArt(src);
      });
    }
  };

  const loadTracks = () => {
    if (!areTracksLoading) {
      if (album.id) {
        SpotifyClient.getAccessToken().then((token) => {
          if (!window.accessToken) {
            window.accessToken = token.access_token;
          }

          SpotifyClient.getTracks(album.id).then((data) => {
            setTracks(data.items);
            setAreTracksLoaded(true);
            setAreTracksLoading(false);
          });
        });
      } else {
        LibrianClient.getAlbumTracks(album.path).then((data) => {
          setTracks(data);
          setAreTracksLoaded(true);
          setAreTracksLoading(false);
        });
      }
    }
  };

  const albumButtons = (
    <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
      <AlbumButtons album={album} clearCurrentAlbum={clearCurrentAlbum} settings={settings} initialCoverArt={coverArt} tracks={tracks} setAddToPlaylist={setAddToPlaylist} />
      <AlbumAdminButtons album={album} settings={settings} initialCoverArt={coverArt} />
    </Container>
  );

  const largeAlbum = () => {
    if (!addToPlaylist) {
      return (
        <React.Fragment>
          <Row style={{ marginTop: '70px' }}>
            <Col lg={3} xl={3}>
              <Card style={styles.albumCardLarge} className="h-55 w-85">
                <Card.Img top src={coverArt} />
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

  if (!isCoverArtLoaded) {
    loadCoverArt();
  }

  if (!areTracksLoaded) {
    loadTracks();
    window.scrollTo(0,0);
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
