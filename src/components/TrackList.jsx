import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import styles from './styles';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';

function TrackList({ tracks, settings, showAlbumCovers }) {
  const [trackAlbum, setTrackAlbum] = useState();
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState();
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);

  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.next();
  };

  const renderTracks = [];

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const handleDownload = (track) => {
    LibrianClient.downloadTrack(track).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = track.name;
        a.click();
      });
    });
  };

  const getAlbum = (track) => {
    if (trackAlbumsLoaded) {
      console.log(trackAlbums.find(trackAlbum => trackAlbum.track.path === track.path));
      return trackAlbums.find(trackAlbum => trackAlbum.track.path === track.path);
    }
  };

  const getTrackAlbums = (tracks) => {
    setTrackAlbumsLoading(true);
    LibrianClient.getTrackAlbums(tracks).then((data) => {
      console.log(data);
      setTrackAlbums(data);
      setTrackAlbumsLoaded(true);
      setTrackAlbumsLoading(false);
    });

    return <React.Fragment />;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getTrackAlbums(tracks);
  }

  const link = (track) => {
    if (settings && settings.features.admin) {
      return <div style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }}><a onClick={() => handleDownload(track)}>Download</a></div>;
    }

    return <React.Fragment />;
  };

  const album = (track) => {
    const ta = getAlbum(track);

    if (showAlbumCovers && ta) {
      if (settings && settings.features) {
        return <Album album={ta} settings={settings} coverArtOnly />;
      }
    }

    return <React.Fragment />;
  };

  if (settings && settings.features) {
    tracks.forEach((track) => {
      if (track.id) {
        track.accessToken = window.accessToken;
      }

      if (showAlbumCovers) {
        renderTracks.push(
          (
            <ListGroupItem style={styles.cardStyle}>
              <Container>
                <Row>
                  <Col lg={2} xl={2}>
                    {album(track)}
                  </Col>
                  <Col lg={10} xl={10}>
                    <div style={{ paddingTop: '30px' }}>{track.name}</div>
                    <Button style={{ paddingTop: '-30px' }} {...buttonProps} onClick={() => playNow(track)}>Play</Button>
                    <Button {...buttonProps} onClick={() => QueueClient.enqueue(track)}>Enqueue</Button>
                  </Col>
                </Row>
              </Container>
              {link(track)}
            </ListGroupItem>
          ),
        );
      } else {
        renderTracks.push(
          (
            <ListGroupItem style={styles.cardStyle}>
              {track.name}
              <Button style={{ paddingTop: '-30px' }} {...buttonProps} onClick={() => playNow(track)}>Play</Button>
              <Button {...buttonProps} onClick={() => QueueClient.enqueue(track)}>Enqueue</Button>
              {link(track)}
            </ListGroupItem>
          ),
        );
      }
    });

    return <ListGroup>{renderTracks}</ListGroup>;
  }

  return <React.Fragment />;
}
export default TrackList;

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
