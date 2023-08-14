import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITrack } from './interface';
import './TrackAlbum.scss';
import { enqueue } from '../lib/queue-client';
import { enqueueTop, next } from '../lib/queue-client';
import { useIntl } from 'react-intl';
import SideBySide from './common/SideBySide/SideBySide';
import { SettingsContext } from './layout/SettingsProvider';

interface ITrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
};

const TrackAlbum: FC<ITrackActions> = ({ track, onClose, applyPadding = false }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  };

  const playNow = () => {
    enqueueTop(track);
    next();
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
        text: intl.formatMessage({ id: 'enqueue' }),
        action: () => {
          enqueue(track);
          onClose();
        },
        style: itemStyle
      },
    ],
    [
      {
        text: intl.formatMessage({ id: 'add_to_playlist' }),
        action: () => { navigate('/playlists', { state: { tracks: [track] } }); },
        style: itemStyle
      },
      { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose(), style: itemStyle },
    ]
  ]

  return (
    <SideBySide data={actions} />
  );
};

export default TrackAlbum;
