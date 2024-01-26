import { FC } from 'react';

import { ITrack } from '../../interface';
import { enqueueTop, next, removeTracksFromQueue } from '../../../lib/service-clients/queue-client';
import { useIntl } from 'react-intl';
import SideBySide from '../../layout/SideBySide/SideBySide';

interface IQueueTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
}

const QueueTrackActions: FC<IQueueTrackActions> = ({ track, onClose, applyPadding = false }) => {
  const intl = useIntl();
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  const actions = [
      {
        text: intl.formatMessage({ id: 'play' }),
        action: () => {
          playNow();
          onClose();
        }
      },
      {
        text: intl.formatMessage({ id: 'delete' }),
        action: async () => {
          await removeTracksFromQueue([track]);
          onClose();
        }
      },
      { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose()},
  ];

  return <SideBySide data={actions} />;
};

export default QueueTrackActions;
