import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  Card, Container, Row, Col,
} from 'react-bootstrap';
import styles from './styles';
import Album from './albums/Album';
import { Track as TrackShape } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/Jukebox';

import './TrackList.css';

function Track({ track, trackAlbums, trackAlbumsLoaded, showAlbumCovers, setCurrentAlbum }) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const getAlbum = (track) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === track.path.substr(0, track.path.lastIndexOf('/')));
    }

    return null;
  };

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

  return (
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
  )
};

export default Track;