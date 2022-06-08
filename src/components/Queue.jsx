import { TrashFill } from 'react-bootstrap-icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';

import Button from './Button';
import ControlButton from './common/ControlButton';
import {
  clearQueue,
  getQueue,
  enqueueTracks,
  removeTracksFromQueue,
} from '../lib/queue-client';
import ContentWithControls from './common/ContentWithControls';
import PlayNowButton from './PlayNowButton';
import Item from './common/Item';
import NoResults from './common/NoResults';
import Paginator from './common/Paginator';

const Queue = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  let renderTracks = [];

  const loadQueue = () => {
    if (realPageSize) {
      const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

      getQueue(realStart, (realStart + realPageSize)).then((data) => {
        setTracks(data.tracks);
        setTotalTracks(data.totalTracks);
        if (data.tracks.length === 0) {
          setIsEmpty(true);
        }
      });
    }
  };

  const clear = () => clearQueue().then(loadQueue());

  useEffect(() => {
    const numberOfTracks = Math.floor((window.innerHeight - 200) / 50);
    setRealPageSize(numberOfTracks);
  }, []);

  useEffect(loadQueue, [selectedPage]);
  useEffect(loadQueue, [realPageSize]);

  const content = () => {
    if (isEmpty) {
      return <NoResults title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

    return (
      <Container fluid>
        <Row>
          <Col lg="12" xl="12" md="12" sm="12">
            <Row>{renderTracks}</Row>
          </Col>
        </Row>
        <Row>
          <Col lg="12" xl="12" md="12" sm="12">
            <Paginator
              disableRandom
              onPageChange={(page) => setSelectedPage(page)}
              style={{ marginTop: '100px' }}
              selectedPage={selectedPage}
              totalItems={totalTracks}
              pageSize={realPageSize}
            />
          </Col>
        </Row>
      </Container>
    )
  };

  const shuffle = () => {
    clearQueue().then(() => {
      enqueueTracks(tracks.sort(() => Math.random() - 0.5)).then(() => {
        loadQueue();
      });
    });
  };

  const remove = (track) => {
    removeTracksFromQueue([track]);
    loadQueue();
  };

  renderTracks = tracks.map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          <PlayNowButton track={track} />
          <Button onClick={() => remove(track)} icon={<TrashFill />} />
        </>
      )}
    />
  ));

  const controls = () => (
    <>
      <ControlButton onClick={clear} disabled={isEmpty} text="Clear Queue" />
      <ControlButton onClick={() => shuffle()} disabled={isEmpty} text="Shuffle Queue" />
      <ControlButton onClick={() => {
        navigate('/playlists', { state: { tracks } })
      }} disabled={isEmpty} text="Save to Playlist" />
    </>
  );

  return <ContentWithControls controls={controls()} content={content()} />;
}

export default Queue;
