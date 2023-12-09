import { FC } from 'react';

import { ITrack } from '../../interface';
import { enqueueTop, next } from '../../../lib/service-clients/queue-client';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../../lib/service-clients/playlist-client';
import { useIntl } from 'react-intl';
import SideBySide from '../../common/SideBySide/SideBySide';

interface IPlaylistTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
  index: number,
  playlistName: string,
}

const PlaylistTrackActions: FC<IPlaylistTrackActions> = ({ track, onClose, applyPadding = false, index, playlistName }) => {
  const intl = useIntl();

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  const deleteTrack = async (trackName: any, trackToDelete: any) => {
    await removeTracksFromPlaylist(trackName, [trackToDelete]);
  };

  const moveTrack = async (trackToMove: any, newPosition: any) => {
    await removeTracksFromPlaylist(playlistName, [trackToMove]);
    await addTrackAtPosition(playlistName, trackToMove, newPosition);
  };

  const actions = [
    {
      text: intl.formatMessage({ id: 'move_up' }),
      action: async () => {
        await moveTrack(track, (index - 1));
        onClose();
      }
    },
    {
      text: intl.formatMessage({ id: 'move_down' }),
      action: async () => {
        await moveTrack(track, (index + 1));
        onClose();
      }
    },
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
        await deleteTrack(playlistName, track);
        onClose();
      }
    },
    { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose()},
  ];

  return <SideBySide data={actions} />;
};

export default PlaylistTrackActions;
