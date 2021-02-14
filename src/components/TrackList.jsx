import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import {
  Card, ListGroupItem, Container, Row, Col,
} from 'react-bootstrap';
import styles from './styles';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';
import { Track, Settings } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';

import './TrackList.css';

const propTypes = {
  tracks: PropTypes.arrayOf(Track),
  settings: Settings.isRequired,
  showAlbumCovers: PropTypes.bool,
  setCurrentAlbum: PropTypes.func.isRequired,
  showDownloadLink: PropTypes.bool,
};

function TrackList({
  tracks,
  settings,
  showAlbumCovers,
  setCurrentAlbum,
}) {
  const [trackAlbum, setTrackAlbum] = useState();
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState();
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);
  const isScreenSmall = window.innerWidth < 700;
  const renderTracks = [];

  const getAlbum = (track) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === track.path.substr(0, track.path.lastIndexOf('/')));
    }

    return null;
  };

  const getTrackAlbums = (tracks) => {
    setTrackAlbumsLoading(true);
    LibrianClient.getTrackAlbums(tracks).then((data) => {
      setTrackAlbums(data);
      setTrackAlbumsLoaded(true);
      setTrackAlbumsLoading(false);
    });

    return <React.Fragment />;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getTrackAlbums(tracks);
  }

  const album = (track) => {
    const ta = getAlbum(track);
    if (showAlbumCovers && ta) {
      if (settings && settings.features) {
        return (
          <Album
            album={ta}
            settings={settings}
            coverArtOnly
            setCurrentAlbum={setCurrentAlbum}
          />
        );
      }
    }

    return <React.Fragment />;
  };

  if (settings && settings.features) {
    tracks.forEach((track) => {
      if (track.path.split('.').pop().toLowerCase() === 'mp3') {
        if (track.id) {
          track.accessToken = window.accessToken;
        }

        if (showAlbumCovers && !isScreenSmall) {
          renderTracks.push(
            (
              <Card style={{ ...styles.cardStyle, color: settings.styles.fontColor, width: '500px', height: '125px', margin: '10px', background: settings.styles.trackBackgroundColor }}>
                <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
                  <Row>
                    {track.name}
                  </Row>
                  <Row>
                    <Col lg={4}>
                      {album(track)}
                    </Col>
                    <Col lg={8}>
                      <PlayNowButton settings={settings} track={track} isScreenSmall={isScreenSmall} />
                      <EnqueueButton settings={settings} track={track} isScreenSmall={isScreenSmall} />
                    </Col>
                  </Row>
                  <Row>
                    <DownloadButton track={track} settings={settings} isScreenSmall={isScreenSmall} />
                  </Row>
                </Container>
              </Card>
            ),
          );
        } else {
          renderTracks.push(
            (
              <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor }}>
                {track.name}
                <br />
                <PlayNowButton settings={settings} track={track} isScreenSmall={isScreenSmall} />
                <EnqueueButton settings={settings} track={track} isScreenSmall={isScreenSmall} />
                <DownloadButton track={track} settings={settings} isScreenSmall={isScreenSmall} />
              </ListGroupItem>
            ),
          );
        }
      }
    });

    return <Container style={{ marginTop: '15px', marginLeft: '0px' }}><Row>{renderTracks}</Row></Container>;
  }

  return <React.Fragment />;
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  showAlbumCovers: false,
  showDownloadLink: false,
  tracks: [],
};

export default TrackList;
