import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  Container, Row, Col, Card,
} from 'react-bootstrap';
import styles from './styles';
import { Track } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import PagedContainer from './common/PagedContainer';
import { SettingsContext } from './layout/Jukebox';

import './TrackList.css';

const propTypes = {
  tracks: PropTypes.arrayOf(Track),
};

function TrackList({ tracks, nextPage, previousPage, paging }) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const content = [];

  tracks.forEach((track) => {
    if (track.path.split('.').pop().toLowerCase() === 'mp3') {
      if (track.id) {
        track.accessToken = window.accessToken;
      }

      const trackCardStyle = {
        ...styles.cardStyle,
        color: settings.styles.fontColor,
        width: '500px',
        margin: '10px',
        background: settings.styles.trackBackgroundColor,
      };

      content.push(
        (
          <Card style={trackCardStyle}>
            <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
              <Row>
                {track.name}
              </Row>
              <Row>
                <Col lg={4} />
                <Col lg={8}>
                  <PlayNowButton
                    track={track}
                    isScreenSmall={isScreenSmall}
                  />
                  <EnqueueButton
                    track={track}
                    isScreenSmall={isScreenSmall}
                  />
                </Col>
              </Row>
              <Row>
                <DownloadButton track={track} isScreenSmall={isScreenSmall} />
              </Row>
            </Container>
          </Card>
        ),
      );
    }
  });

  return (
    <PagedContainer
      paging={paging}
      content={content}
      clientNextPage={nextPage}
      clientPreviousPage={previousPage}
    />
  );
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
};

export default TrackList;
