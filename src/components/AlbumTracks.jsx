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
import PagingButtons from './common/PagingButtons';
import { SettingsContext } from './layout/Jukebox';

import './TrackList.css';

const propTypes = {
  tracks: PropTypes.arrayOf(Track),
};

function TrackList({ tracks, nextPage, previousPage, paging }) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const renderTracks = [];

  if (settings && settings.features) {
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

        renderTracks.push(
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
      <Container style={{ marginTop: '15px', marginLeft: '0px' }}>
        <Row>
          <Col md={10} lg={10} xl={10}>
            <Row>{renderTracks}</Row>
          </Col>
          <Col md={2} lg={2} xl={2}>
            <PagingButtons
              loadMore={() => nextPage(paging)}
              loadPrevious={() => previousPage(paging)}
              pages={paging.pages}
              page={paging.currentPage}
            />
          </Col>
        </Row>
      </Container>
    );
  }

  return <React.Fragment />;
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
};

export default TrackList;
