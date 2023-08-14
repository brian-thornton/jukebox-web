import { FC, useContext } from 'react';

import { ITrack } from '../../interface';
import Picker from '../../common/Picker/Picker';
import { enqueueTop, next, removeTracksFromQueue } from '../../../lib/queue-client';
import { useIntl } from 'react-intl';
import SideBySide from '../../common/SideBySide/SideBySide';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IQueueTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
};

const QueueTrackActions: FC<IQueueTrackActions> = ({ track, onClose, applyPadding = false }) => {
  const settings = useContext(SettingsContext);
  const intl = useIntl();
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  };

  const actions = [
    [
      {
        text: intl.formatMessage({ id: 'play' }),
        action: () => {
          playNow();
          onClose();
        },
        style: itemStyle
      },
      {
        text: intl.formatMessage({ id: 'delete' }),
        action: async () => {
          await removeTracksFromQueue([track]);
          onClose();
        },
        style: itemStyle
      },
    ],
    [
      { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose(), style: itemStyle },
    ]
  ];

  return (
    <SideBySide data={actions} />
  );
};

export default QueueTrackActions;
