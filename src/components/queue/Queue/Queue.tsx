import { TrashFill, XLg } from 'react-bootstrap-icons';
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { applyLighting } from '../../../lib/helper/lightingHelper';
import Button from '../../common/Button/Button';
import Confirm from '../../common/Confirm/Confirm';
import {
  clearQueue,
  removeTracksFromQueue,
} from '../../../lib/service-clients/queue-client';
import ContentWithControls from '../../common/ContentWithControls/ContentWithControls';
import PlayNowButton from '../../PlayNowButton';
import NoResults from '../../common/NoResults/NoResults';
import { SettingsContext } from '../../layout/SettingsProvider';
import { calculatePageSize } from '../../../lib/helper/styleHelper';
import PaginatedList from '../../common/PaginatedList/PaginatedList';
import QueueControls from '../QueueControls/QueueControls';
import { ITrack } from '../../interface';
import QueueTrackActions from '../QueueTrackActions/QueueTrackActions';
import { useQueue } from '../../../hooks/use-queue';
import styles from './Queue.module.css';

const Queue = () => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { isScreenSmall, screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [clearConfirm, setClearConfirm] = useState(false);
  let itemsPerPage = calculatePageSize('item', 0, 63);
  const [clickedTrack, setClickedTrack] = useState<ITrack | undefined>(undefined);
  const { tracks, totalTracks, isLoaded, isEmpty, loadQueue } = useQueue(selectedPage, itemsPerPage);
  const clear = () => clearQueue().then(() => loadQueue());

  if (screen?.isMobile) {
    itemsPerPage = 11;
  }

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
    <div className={styles.queueContainer}>
      {!clearConfirm && (
          <Button icon={<XLg />} onClick={() => setClearConfirm(true)} />
      )}
      {clickedTrack && (
        <QueueTrackActions
          onClose={() => {
            setClickedTrack(undefined);
            loadQueue();
          }}
          track={clickedTrack} />
      )}
      {!clickedTrack && content()}
    </div>
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
