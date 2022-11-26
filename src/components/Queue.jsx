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
import ExpandRow from './common/ExpandRow';
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
  const { controlButtonSize } = settings.styles;
  const trackHeight = (!controlButtonSize || controlButtonSize === 'small') ? 50 : 80;
  const reserve = (!controlButtonSize || controlButtonSize === 'small') ? 300 : 250;
  const itemsPerPage = pageSize('item', reserve, trackHeight);
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 60;
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

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

  const buttons = (track) => {
    return (
      <>
        {settings.features.play && <PlayNowButton track={track} />}
        <Button width={buttonWidth} height={buttonHeight} onClick={() => remove(track)} icon={<TrashFill />} />
      </>
    )
  };

  const content = () => {
    if (isEmpty) {
      return <NoResults applyMargin={false} title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

    return (
      <>
        {!clearConfirm && (
          <Container {...swipe} fluid>
            <Row >
              <Col lg="12" xl="12" md="12" sm="12">
                <Row>
                  {tracks.map(track => (
                    <>
                      {isScreenSmall && <ExpandRow text={track.name} buttons={buttons(track)}/>}
                      {!isScreenSmall && (
                        <Item
                          text={track.name}
                          buttons={buttons(track)}
                        />
                      )}
                    </>
                  ))
                  }
                </Row>
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
      <ControlButton width="100%" onClick={() => setClearConfirm(true)} disabled={isEmpty || clearConfirm} text="Clear Queue" height={buttonHeight} style={{ fontSize }} />
      <ControlButton width="100%" onClick={() => shuffle()} disabled={isEmpty || clearConfirm} text="Shuffle Queue" height={buttonHeight} style={{ fontSize }} />
      {settings.features.playlists && <ControlButton width="100%" onClick={() => {
        navigate('/playlists', { state: { tracks } })
      }} disabled={isEmpty || clearConfirm} text="Save to Playlist" height={buttonHeight} style={{ fontSize }} />}
    </>
  );

  return (
    <>
      {!isScreenSmall && <ContentWithControls controls={controls()} content={content()} />}
      {isScreenSmall && (
        <Container fluid style={{ marginTop: '60px', paddingRight: '0px' }}>
          {!clearConfirm && (
            <Row className="trackName">
              <Col lg="12" xl="12" md="12" sm="12">
                <Button icon={<XLg />} onClick={() => setClearConfirm(true)} />
              </Col>
            </Row>
          )}
          <Row className="trackName">
            <Col lg="12" xl="12" md="12" sm="12">
              {content()}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Queue;
