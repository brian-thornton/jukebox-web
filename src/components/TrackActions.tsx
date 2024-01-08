import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITrack } from './interface';
import './TrackAlbum.scss';
import { enqueue } from '../lib/service-clients/queue-client';
import { enqueueTop, next } from '../lib/service-clients/queue-client';
import { useIntl } from 'react-intl';
import SideBySide from './common/SideBySide/SideBySide';

interface ITrackActions {
  track?: ITrack,
  onClose: Function
}

const TrackAlbum: FC<ITrackActions> = ({ track, onClose }) => {
  const navigate = useNavigate();
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
      },
    },
    {
      text: intl.formatMessage({ id: 'enqueue' }),
      action: () => {
        enqueue(track);
        onClose();
      },
    },
    {
      text: intl.formatMessage({ id: 'add_to_playlist' }),
      action: () => { navigate('/playlists', { state: { tracks: [track] } }); },
    },
    { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose() },
  ];

  return <SideBySide data={actions} />;
};

export default TrackAlbum;
