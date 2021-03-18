import { PropTypes } from 'prop-types';
import React from 'react';
import {
  Container, Row, Col, Card,
} from 'react-bootstrap';
import styles from './styles';
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
}) {

  const isScreenSmall = window.innerWidth < 700;
  const renderTracks = [];

  if (settings && settings.features) {
    tracks.forEach((track) => {
      if (track.path.split('.').pop().toLowerCase() === 'mp3') {

        if (track.id) {
          track.accessToken = window.accessToken;
        }

        renderTracks.push(
          (
            <Card style={{ ...styles.cardStyle, color: settings.styles.fontColor, width: '500px', margin: '10px', background: settings.styles.trackBackgroundColor }}>
              <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
                <Row>
                  {track.name}
                </Row>
                <Row>
                  <Col lg={4} />
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
