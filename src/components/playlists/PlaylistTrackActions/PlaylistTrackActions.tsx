import { FC, useContext } from 'react';

import { ITrack } from '../../interface';
import Picker from '../../common/Picker/Picker';
import { enqueueTop, next } from '../../../lib/service-clients/queue-client';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../../lib/service-clients/playlist-client';
import { useIntl } from 'react-intl';
import SideBySide from '../../common/SideBySide/SideBySide';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IPlaylistTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
  index: number,
  playlistName: string,
}

const PlaylistTrackActions: FC<IPlaylistTrackActions> = ({ track, onClose, applyPadding = false, index, playlistName }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  };

  const deleteTrack = async (trackName: any, trackToDelete: any) => {
    await removeTracksFromPlaylist(trackName, [trackToDelete]);
  };

  const moveTrack = async (trackToMove: any, newPosition: any) => {
    await removeTracksFromPlaylist(playlistName, [trackToMove]);
    await addTrackAtPosition(playlistName, trackToMove, newPosition);
  };

  const actions = [
    [
      {
        text: intl.formatMessage({ id: 'move_up' }),
        action: async () => {
          await moveTrack(track, (index - 1));
          onClose();
        },
        style: itemStyle 
      },
      {
        text: intl.formatMessage({ id: 'move_down' }),
        action: async () => {
          await moveTrack(track, (index + 1));
          onClose();
        },
        style: itemStyle 
      },
    ],
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
          await deleteTrack(playlistName, track);
          onClose();
        },
        style: itemStyle 
      }
    ],
    [
      { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose(), style: itemStyle },
    ],
  ];
  
  return (
    <SideBySide data={actions} />
  );
};

export default PlaylistTrackActions;
