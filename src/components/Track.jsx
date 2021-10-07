import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  Card, Container, Row, Col,
} from 'react-bootstrap';
import styles from './styles';
import TrackAlbum from './TrackAlbum';
import { Track as TrackShape } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';

import './TrackList.css';

const propTypes = {
  setCurrentAlbum: PropTypes.func,
  showAlbumCovers: PropTypes.bool,
  track: TrackShape.isRequired,
  trackAlbums: PropTypes.arrayOf(TrackShape).isRequired,
  trackAlbumsLoaded: PropTypes.bool,
};

function Track({
  showAlbumCovers,
  setCurrentAlbum,
  track,
  trackAlbums,
  trackAlbumsLoaded,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const getAlbum = (albumTrack) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === albumTrack.path.substr(0, albumTrack.path.lastIndexOf('/')));
    }

    return null;
  };

  const album = (albumTrack) => {
    const ta = getAlbum(albumTrack);
    if (showAlbumCovers && ta) {
      if (settings && settings.features) {
        return (
          <TrackAlbum
            album={ta}
            setCurrentAlbum={setCurrentAlbum}
          />
        );
      }
    }

    return <React.Fragment />;
  };

  const trackCardStyle = {
    ...styles.cardStyle,
    color: settings.styles.fontColor,
    width: '400px',
    height: '125px',
    margin: '10px',
    background: settings.styles.trackBackgroundColor,
  };

  const trackNameStyle = {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: settings.styles.listFont,
  };

  return (
    <Card style={trackCardStyle}>
      <Container style={{ marginTop: '0px', marginBottom: '0px', marginRight: '0px' }}>
        <Row>
          <div style={trackNameStyle}>
            {track.name}
          </div>
        </Row>
        <Row>
          <Col lg={4}>
            {album(track)}
          </Col>
          <Col lg={8}>
            <Container style={{ marginTop: '0px' }}>
              <Row>
                <PlayNowButton track={track} isScreenSmall={isScreenSmall} />
                <EnqueueButton track={track} isScreenSmall={isScreenSmall} />
              </Row>
              <Row>
                <DownloadButton track={track} isScreenSmall={isScreenSmall} />
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

Track.defaultProps = {
  setCurrentAlbum: null,
  showAlbumCovers: false,
  trackAlbumsLoaded: false,
};

Track.propTypes = propTypes;

export default Track;
