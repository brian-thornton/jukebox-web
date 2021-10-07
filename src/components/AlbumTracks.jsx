import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  Container, Row, Col, Card,
} from 'react-bootstrap';
import styles from './styles';
import { Paging, Track } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import PagedContainer from './common/PagedContainer';
import { SettingsContext } from './layout/SettingsProvider';

import './TrackList.css';

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  paging: Paging.isRequired,
  previousPage: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
};

function TrackList({
  nextPage,
  paging,
  previousPage,
  tracks,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  let content = [];

  const trackCardStyle = {
    ...styles.cardStyle,
    color: settings.styles.fontColor,
    width: '500px',
    margin: '10px',
    background: settings.styles.trackBackgroundColor,
  };

  content = tracks.map(track => (
    <Card style={trackCardStyle}>
      <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
        <Row style={{ fontFamily: settings.styles.listFont }}>
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
  ));

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
