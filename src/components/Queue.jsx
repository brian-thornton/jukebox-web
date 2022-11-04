import { TrashFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { XLg } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';

import { applyLighting } from '../lib/lightingHelper';
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
import './Queue.scss';
import { handlers } from '../lib/gesture-helper';
import { pageSize } from '../lib/styleHelper';

const Queue = () => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [clearConfirm, setClearConfirm] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const itemsPerPage = pageSize('item', 200, 55);

  const loadQueue = () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

    getQueue(start, (start + itemsPerPage)).then((data) => {
      setTracks(data.tracks);
      setTotalTracks(data.totalTracks);
      if (data.tracks.length === 0) {
        setIsEmpty(true);
      }
    });
  };

  const monitorQueue = () => {
    setTimeout(() => monitorQueue(), 3000)
    loadQueue();
  };

  const clear = () => clearQueue().then(loadQueue());

  useEffect(() => {
    applyLighting(settings, 'Queue');
    monitorQueue();
  }, []);

  useEffect(loadQueue, [selectedPage]);

  const confirm = (
    <Confirm
      text="Are you sure you want to clear all tracks in the queue?"
      onConfirm={clear}
      onCancel={() => {
        setClearConfirm(false);
        applyLighting(settings, 'Queue');
      }}
    />
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

    return (
      <>
        {!clearConfirm && (
          <Container {...swipe} fluid>
            <Row>
              <Col lg="12" xl="12" md="12" sm="12">
                <Row>
                  {tracks.map(track => (
                    <Item
                      text={track.name}
                      buttons={(
                        <>
                          {settings.features.play && <PlayNowButton track={track} />}
                          <Button onClick={() => remove(track)} icon={<TrashFill />} />
                        </>
                      )}
                    />
                  ))
                  }</Row>
              </Col>
            </Row>
            <Row>
              <Col lg="12" xl="12" md="12" sm="12">
                <Paginator
                  disableRandom
                  onPageChange={(page) => setSelectedPage(page)}
                  className="queue"
                  selectedPage={selectedPage}
                  totalItems={totalTracks}
                  pageSize={itemsPerPage}
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

  const controls = () => (
    <>
      <ControlButton width="100%" onClick={() => setClearConfirm(true)} disabled={isEmpty || clearConfirm} text="Clear Queue" />
      <ControlButton width="100%" onClick={() => shuffle()} disabled={isEmpty || clearConfirm} text="Shuffle Queue" />
      {settings.features.playlists && <ControlButton width="100%" onClick={() => {
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
