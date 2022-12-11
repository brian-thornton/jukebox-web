import { TrashFill, XLg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
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
import NoResults from './common/NoResults';
import { SettingsContext } from './layout/SettingsProvider';
import './Queue.scss';
import { pageSize } from '../lib/styleHelper';
import PaginatedList from './common/PaginatedList';

const Queue = () => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [clearConfirm, setClearConfirm] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
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
    setTimeout(() => monitorQueue(), 10000);
    loadQueue();
  };

  const clear = () => clearQueue().then(loadQueue());

  useEffect(() => {
    applyLighting(settings, 'Queue');
    monitorQueue();
  }, []);

  useEffect(loadQueue, [selectedPage]);

  const remove = (track) => {
    removeTracksFromQueue([track]);
    loadQueue();
  };

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

  const itemButtons = track => (
    <>
      {settings.features.play && <PlayNowButton track={track} />}
      <Button
        width={buttonWidth}
        height={buttonHeight}
        onClick={() => remove(track)}
        icon={<TrashFill />}
      />
    </>
  );

  const items = () => (
    tracks.map(track => (
      {
        text: track.name,
        buttons: itemButtons(track),
      }
    ))
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults applyMargin={false} title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

    return (
      <>
        {!clearConfirm && (
          <PaginatedList
            items={items()}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageSize={itemsPerPage}
            totalItems={totalTracks}
          />
        )}
        {clearConfirm && confirm}
      </>
    );
  };

  const shuffle = () => {
    clearQueue().then(() => {
      enqueueTracks(tracks.sort(() => Math.random() - 0.5)).then(() => {
        loadQueue();
      });
    });
  };

  const controls = () => (
    <>
      <ControlButton width="100%" onClick={() => setClearConfirm(true)} disabled={isEmpty || clearConfirm} text="Clear Queue" height={buttonHeight} style={{ fontSize }} />
      <ControlButton width="100%" onClick={() => shuffle()} disabled={isEmpty || clearConfirm} text="Shuffle Queue" height={buttonHeight} style={{ fontSize }} />
      {settings.features.playlists && (
        <ControlButton
          width="100%"
          onClick={() => {
            navigate('/playlists', { state: { tracks } });
          }}
          disabled={isEmpty || clearConfirm}
          text="Save to Playlist"
          height={buttonHeight}
          style={{ fontSize }}
        />
      )}
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
};

Button.defaultProps = {
  content: '',
  icon: <></>,
  disabled: false,
  isToggle: false,
  isToggled: false,
  isSelected: false,
  height: '',
  width: '',
  style: {},
  id: '',
  hideOnSmall: false,
};

export default Queue;
