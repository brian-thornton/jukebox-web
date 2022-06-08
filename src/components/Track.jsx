import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  Card, Container, Row, Col,
} from 'react-bootstrap';

import AddToPlaylistButton from './common/AddToPlaylistButton';
import styles from './styles';
import TrackAlbum from './TrackAlbum';
import { Track as TrackShape } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';

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

    return <></>;
  };

  const trackCardStyle = {
    ...styles.cardStyle,
    color: settings.styles.fontColor,
    width: '100%',
    background: settings.styles.trackBackgroundColor,
  };

  const trackNameStyle = {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: settings.styles.listFont,
  };

  // TODO: Make this work with \
  const pathParts = track.path.split('/');
  const albumFolder = pathParts[pathParts.length - 2];

  return (
    <Card style={trackCardStyle}>
      <Container style={{ width: '100%', marginTop: '0px', marginBottom: '0px', marginRight: '0px', paddingLeft: '0px' }}>
        <Row>
          <Col lg={1} md={1}>
            {album(track)}
          </Col>
          <Col lg={8} md={8}>
            <div style={trackNameStyle}>
              {`${albumFolder} - ${track.name}`}
            </div>
          </Col>
          <Col lg={2}>
            <AddToPlaylistButton track={track} />
            <PlayNowButton track={track} isScreenSmall={isScreenSmall} />
            <EnqueueButton track={track} isScreenSmall={isScreenSmall} />
            <DownloadButton track={track} isScreenSmall={isScreenSmall} />
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
