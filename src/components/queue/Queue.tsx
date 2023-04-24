import { TrashFill, XLg } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { applyLighting } from '../../lib/lightingHelper';
import Button from '../Button';
import Confirm from '../common/Confirm';
import {
  clearQueue,
  getQueue,
  removeTracksFromQueue,
} from '../../lib/queue-client';
import ContentWithControls from '../common/ContentWithControls';
import PlayNowButton from '../PlayNowButton';
import NoResults from '../common/NoResults';
import { SettingsContext } from '../layout/SettingsProvider';
import './Queue.scss';
import { calculatePageSize } from '../../lib/styleHelper';
import PaginatedList from '../common/PaginatedList';
import FullWidthRow from '../common/FullWidthRow';
import QueueControls from './QueueControls';

const Queue = () => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const [tracks, setTracks] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [clearConfirm, setClearConfirm] = useState(false);
  const { controlButtonSize } = settings.styles || {};
  const trackHeight = (!controlButtonSize || controlButtonSize === 'small') ? 50 : 80;
  const reserve = (!controlButtonSize || controlButtonSize === 'small') ? 300 : 250;
  const itemsPerPage = calculatePageSize('item', reserve, trackHeight);
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
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

  const clear = () => clearQueue().then(() => loadQueue());

  useEffect(() => {
    applyLighting(settings, 'Queue');
    monitorQueue();
  }, []);

  useEffect(loadQueue, [selectedPage]);

  const remove = (track: any) => {
    removeTracksFromQueue([track]);
    loadQueue();
  };

  const confirm = (
    <Confirm
      text={intl.formatMessage({ id: 'delete_queue_text' })}
      onConfirm={clear}
      onCancel={() => {
        setClearConfirm(false);
        applyLighting(settings, 'Queue');
      }}
    />
  );

  const itemButtons = (track: any) => (
    <>
      {settings?.features?.play && <PlayNowButton track={track} />}
      <Button
        style={{ fontSize }}
        width={buttonWidth}
        height={buttonHeight}
        onClick={() => remove(track)}
        icon={<TrashFill />}
      />
    </>
  );

  const items = () => (
    tracks.map((track: any) => (
      {
        text: track.name,
        buttons: itemButtons(track),
      }
    ))
  );

  const content = () => {
    if (isEmpty) {
      return (
        <NoResults
          applyMargin={false}
          title={intl.formatMessage({id: 'queue_empty_title'})}
          text={intl.formatMessage({id: 'queue_empty_text'})}
        />);
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
            onItemClick={() => {}}
          />
        )}
        {clearConfirm && confirm}
      </>
    );
  };

  return (
    <>
      {!isScreenSmall && (
        <ContentWithControls
          controls={(
            <QueueControls
              loadQueue={loadQueue}
              tracks={tracks}
              setClearConfirm={setClearConfirm}
              clearConfirm={clearConfirm} />)
          }
          content={content()}
        />)}
      {isScreenSmall && (
        <Container fluid className="queueContainer">
          {!clearConfirm && (
            <FullWidthRow>
              <Button icon={<XLg />} onClick={() => setClearConfirm(true)} />
            </FullWidthRow>
          )}
          <FullWidthRow>
            {content()}
          </FullWidthRow>
        </Container>
      )}
    </>
  );
};

export default Queue;
