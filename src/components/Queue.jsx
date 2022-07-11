import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { XLg } from 'react-bootstrap-icons';
import { TrashFill } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import Button from './Button';
import Confirm from './common/Confirm';
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
import { SettingsContext } from './layout/SettingsProvider';
import styles from './Queue.module.css';

const Queue = () => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [clearConfirm, setClearConfirm] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
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
    const numberOfTracks = Math.floor((window.innerHeight - 200) / 55);
    setRealPageSize(numberOfTracks);
  }, []);

  useEffect(loadQueue, [selectedPage]);
  useEffect(loadQueue, [realPageSize]);

  const confirm = (
    <Confirm
      text="Are you sure you want to clear all tracks in the queue?"
      onConfirm={clear}
      onCancel={() => setClearConfirm(false)}
    />
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

    return (
      <>
        {!clearConfirm && (
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
                  className={styles.queue}
                  selectedPage={selectedPage}
                  totalItems={totalTracks}
                  pageSize={realPageSize}
                />
              </Col>
            </Row>
          </Container>
        )}
        {clearConfirm && confirm}
      </>
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
          {settings.features.play && <PlayNowButton track={track} />}
          <Button onClick={() => remove(track)} icon={<TrashFill />} />
        </>
      )}
    />
  ));

  const controls = () => (
    <>
      <ControlButton onClick={() => setClearConfirm(true)} disabled={isEmpty || clearConfirm} text="Clear Queue" />
      <ControlButton onClick={() => shuffle()} disabled={isEmpty || clearConfirm} text="Shuffle Queue" />
      {settings.features.playlists && <ControlButton onClick={() => {
        navigate('/playlists', { state: { tracks } })
      }} disabled={isEmpty || clearConfirm} text="Save to Playlist" />}
    </>
  );

  return (
    <>
      {!isScreenSmall && <ContentWithControls controls={controls()} content={content()} />}
      {isScreenSmall && (
        <>
          <Container>
            {!clearConfirm && (
              <Row>
                <Button icon={<XLg />} onClick={() => setClearConfirm(true)} />
              </Row>
            )}
            <Row>
              {content()}
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

export default Queue;
