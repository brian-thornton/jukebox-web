import { FC } from 'react';

import { ITrack } from '../interface';
import Picker from '../common/Picker';
import { enqueueTop, next, removeTracksFromQueue } from '../../lib/queue-client';
import { useIntl } from 'react-intl';

interface IQueueTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
};

const QueueTrackActions: FC<IQueueTrackActions> = ({ track, onClose, applyPadding = false }) => {
  const intl = useIntl();
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Picker
      itemHeight='60px'
      applyPadding={false}
      items={[
        {
          buttonText: intl.formatMessage({ id: 'play' }),
          buttonWidth: "100%",
          onClick: () => {
            playNow();
            onClose();
          },
        },
        {
          buttonText: intl.formatMessage({ id: 'delete' }),
          buttonWidth: "100%",
          onClick: async () => {
            await removeTracksFromQueue([track]);
            onClose();
          },
        },
        {
          buttonText: intl.formatMessage({ id: 'cancel' }),
          buttonWidth: "100%",
          onClick: () => onClose(),
        },
      ]}
    />
  );
};

export default QueueTrackActions;
