import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import CoverArtSearchModal from './CoverArtSearchModal';
import LibrianClient from '../lib/librarian-client';
import QueueClient from '../lib/queue-client';
import defaultCover from '../default_album.jpg';
import TrackList from './TrackList';
import Playlists from './Playlists';
import styles from './styles';
import SpotifyClient from '../lib/spotify-client';
import { Album, Settings } from './shapes';

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
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);

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

  const enqueueAlbum = () => QueueClient.enqueueTracks(tracks);
  const saveCoverArtToLibrary = () => LibrianClient.saveCoverArt({ album, url: coverArt });
  const removeCoverArt = () => LibrianClient.removeCoverArt(album);

  const playAlbum = () => {
    QueueClient.enqueueTracksTop(tracks);
    QueueClient.next();
  };

  const albumButtons = () => {
    const buttons = [];
    const props = {
      block: true,
      variant: 'outline-light',
      style: { background: settings.styles.buttonBackgroundColor },
    };

    buttons.push(<Button {...props} onClick={clearCurrentAlbum}>Back to Albums</Button>);
    buttons.push(<Button {...props} onClick={playAlbum}>Play Album</Button>);
    buttons.push(
      <Button {...props} onClick={enqueueAlbum}>Enqueue Album</Button>,
    );
    buttons.push(
      <Button {...props} onClick={() => setAddToPlaylist(true)}>Add to Playlist</Button>,
    );

    if (settings.features.admin) {
      buttons.push(<Button {...props} onClick={removeCoverArt}>Remove Cover Art</Button>);
      buttons.push(<Button {...props} onClick={getCoverArt}>Refresh Cover Art</Button>);
      buttons.push((
        <Button {...props} onClick={() => setIsCustomSearchOpen(true)}>
          Custom Search
        </Button>
      ));
      buttons.push(<Button {...props} onClick={saveCoverArtToLibrary}>Save Cover Art</Button>);
    }
    return buttons;
  };

  const largeAlbum = () => {
    if (!addToPlaylist) {
      return (
        <React.Fragment>
          <Container>
            <Row>
              <Col lg={4} xl={4}>
                <Card style={styles.albumCardLarge} className="h-55 w-85">
                  <Card.Img top src={coverArt} />
                  <Card.Body>
                    <Card.Title style={{ maxHeight: '25px', fontSize: '15px' }}>{album.name}</Card.Title>
                  </Card.Body>
                  {albumButtons()}
                </Card>
              </Col>
              <Col lg={8} xl={8}>
                <TrackList tracks={tracks} settings={settings} showDownloadLink />
              </Col>
            </Row>
          </Container>
          <CoverArtSearchModal
            settings={settings}
            album={album}
            isOpen={isCustomSearchOpen}
            handleClose={() => setIsCustomSearchOpen(false)}
          />
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
  }

  return largeAlbum();
}

AlbumDetail.propTypes = propTypes;

export default AlbumDetail;
