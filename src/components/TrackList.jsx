import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import {
  Card, ListGroupItem, Container, Row, Col,
} from 'react-bootstrap';
import styles from './styles';
import { getTrackAlbums } from '../lib/librarian-client';
import Album from './albums/Album';
import { Track } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/Jukebox';

import './TrackList.css';

const propTypes = {
  tracks: PropTypes.arrayOf(Track),
  showAlbumCovers: PropTypes.bool,
  setCurrentAlbum: PropTypes.func.isRequired,
  showDownloadLink: PropTypes.bool,
};

function TrackList({
  tracks,
  showAlbumCovers,
  setCurrentAlbum,
}) {
  const settings = useContext(SettingsContext);
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

  const getAlbums = async (tracks) => {
    setTrackAlbumsLoading(true);
    const data = await getTrackAlbums(tracks);
    setTrackAlbums(data);
    setTrackAlbumsLoaded(true);
    setTrackAlbumsLoading(false);
    return <React.Fragment />;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getAlbums(tracks);
  }

  useEffect(() => {
    getAlbums(tracks);
  }, [tracks])

  const album = (track) => {
    const ta = getAlbum(track);
    if (showAlbumCovers && ta) {
      if (settings && settings.features) {
        return (
          <Album
            album={ta}
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

        if (trackAlbumsLoaded && showAlbumCovers && !isScreenSmall) {
          renderTracks.push(
            (
              <Card style={{ ...styles.cardStyle, color: settings.styles.fontColor, width: '400px', height: '125px', margin: '10px', background: settings.styles.trackBackgroundColor }}>
                <Container style={{ marginTop: '0px', marginBottom: '0px', marginRight: '0px' }}>
                  <Row>
                    <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.name}
                    </div>
                  </Row>
                  <Row>
                    <Col lg={4}>
                      {album(track)}
                    </Col>
                    <Col lg={8}>
                      <PlayNowButton track={track} isScreenSmall={isScreenSmall} />
                      <EnqueueButton track={track} isScreenSmall={isScreenSmall} />
                    </Col>
                  </Row>
                  <Row>
                    <DownloadButton track={track} isScreenSmall={isScreenSmall} />
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
                <PlayNowButton track={track} isScreenSmall={isScreenSmall} />
                <EnqueueButton track={track} isScreenSmall={isScreenSmall} />
                <DownloadButton track={track} isScreenSmall={isScreenSmall} />
              </ListGroupItem>
            ),
          );
        }
      }
    });

    return <Container fluid style={{ marginTop: '15px', marginLeft: '0px' }}><Row>{renderTracks}</Row></Container>;
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
