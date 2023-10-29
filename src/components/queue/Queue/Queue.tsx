import { TrashFill, XLg } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { applyLighting } from '../../../lib/helper/lightingHelper';
import Button from '../../Button';
import Confirm from '../../common/Confirm/Confirm';
import {
  clearQueue,
  removeTracksFromQueue,
} from '../../../lib/service-clients/queue-client';
import ContentWithControls from '../../common/ContentWithControls/ContentWithControls';
import PlayNowButton from '../../PlayNowButton';
import NoResults from '../../common/NoResults/NoResults';
import { SettingsContext } from '../../layout/SettingsProvider';
import './Queue.scss';
import { calculatePageSize } from '../../../lib/helper/styleHelper';
import PaginatedList from '../../common/PaginatedList/PaginatedList';
import FullWidthRow from '../../common/FullWidthRow/FullWidthRow';
import QueueControls from '../QueueControls/QueueControls';
import { ITrack } from '../../interface';
import QueueTrackActions from '../QueueTrackActions/QueueTrackActions';
import { useQueue } from '../../../hooks/use-queue';

const Queue = () => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { isScreenSmall, screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [clearConfirm, setClearConfirm] = useState(false);
  const { controlButtonSize } = settings.styles || {};
  const trackHeight = (!controlButtonSize || controlButtonSize === 'small') ? 50 : 80;
  const reserve = (!controlButtonSize || controlButtonSize === 'small') ? 300 : 250;
  let itemsPerPage = calculatePageSize('item', reserve, trackHeight);
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const [clickedTrack, setClickedTrack] = useState<ITrack | undefined>(undefined);
  const { tracks, totalTracks, isLoaded, isEmpty, loadQueue } = useQueue(selectedPage, itemsPerPage);

  if (screen?.isMobile) {
    itemsPerPage = 11;
  }

  const clear = () => clearQueue().then(() => loadQueue());

  useEffect(() => {
    applyLighting(settings, 'Queue');
    //monitorQueue();
  }, []);

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
        onItemClick: () => {
          setClickedTrack(track)
        },
        text: track.name,
        buttons: itemButtons(track),
      }
    ))
  );

  const content = () => {
    return isEmpty ? (
      <NoResults
        applyMargin={false}
        title={intl.formatMessage({ id: 'queue_empty_title' })}
        text={intl.formatMessage({ id: 'queue_empty_text' })}
      />
    ) : (
      <>
        {!clearConfirm && (
          <PaginatedList
            items={items()}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageSize={itemsPerPage}
            totalItems={totalTracks}
            onItemClick={() => { }}
            hideButtons={screen?.isMobile}
          />
        )}
        {clearConfirm && confirm}
      </>
    );
  };

  return isScreenSmall ? (
    <Container fluid className="queueContainer" style={{ paddingLeft: 0, paddingRight: 0 }}>
      {!clearConfirm && (
        <FullWidthRow>
          <Button icon={<XLg />} onClick={() => setClearConfirm(true)} />
        </FullWidthRow>
      )}
      {clickedTrack && (
        <QueueTrackActions
          onClose={() => {
            setClickedTrack(undefined);
            loadQueue();
          }}
          track={clickedTrack} />
      )}
      {!clickedTrack && (
        <FullWidthRow>
          {content()}
        </FullWidthRow>
      )}
    </Container>
  ) : (
    <ContentWithControls
      controls={(
        <QueueControls
          loadQueue={loadQueue}
          tracks={tracks}
          setClearConfirm={setClearConfirm}
          clearConfirm={clearConfirm} />)
      }
      content={content()}
    />
  );
};

export default Queue;
