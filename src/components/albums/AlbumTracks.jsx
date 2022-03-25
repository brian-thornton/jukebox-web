import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';

import Item from '../common/Item';
import { Paging, Track } from '../shapes';
import DownloadButton from '../DownloadButton';
import PlayNowButton from '../PlayNowButton';
import EnqueueButton from '../EnqueueButton';
import Paginator from '../common/Paginator';

import AddToPlaylistButton from '../common/AddToPlaylistButton';

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  paging: Paging.isRequired,
  previousPage: PropTypes.func.isRequired,
  setAddToPlaylist: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
};

function TrackList({
  setAddToPlaylist,
  setAddTracks,
  tracks,
}) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  const isScreenSmall = window.innerWidth < 700;
  let content = [];

  useEffect(() => {
    const numberOfTracks = Math.floor((window.innerHeight - 200) / 50);
    setRealPageSize(numberOfTracks);
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  content = tracks.slice(realStart, (realStart + realPageSize)).map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          <PlayNowButton track={track} />
          <EnqueueButton track={track} />
          <AddToPlaylistButton track={track} setAddToPlaylist={setAddToPlaylist} setAddTracks={setAddTracks} />
          <DownloadButton track={track} isScreenSmall={isScreenSmall} />
        </>
      )}
    />
  ));

  return (
    <Container fluid>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row>{content}</Row>
        </Col>
      </Row>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Paginator
            disableRandom
            onPageChange={(page) => setSelectedPage(page)}
            style={{ marginTop: '100px' }}
            selectedPage={selectedPage}
            totalItems={tracks.length}
            pageSize={realPageSize}
          />
        </Col>
      </Row>
    </Container>
  );
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
};

export default TrackList;
