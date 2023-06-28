import { FC } from 'react';

import { ITrack } from '../interface';
import Picker from '../common/Picker';
import { enqueueTop, next } from '../../lib/queue-client';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';
import { useIntl } from 'react-intl';

interface IPlaylistTrackActions {
  track?: ITrack,
  onClose: Function,
  applyPadding?: boolean,
  index: number,
  playlistName: string,
};

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

  return (
    <Picker
      itemHeight='60px'
      applyPadding={true}
      items={[
        {
          buttonText: intl.formatMessage({ id: 'move_up' }),
          buttonWidth: "100%",
          onClick: async () => {
            await moveTrack(track, (index - 1));
            onClose();
          },
        },
        {
          buttonText: intl.formatMessage({ id: 'move_down' }),
          buttonWidth: "100%",
          onClick: async () => {
            await moveTrack(track, (index + 1));
            onClose();
          },
        },
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
            await deleteTrack(playlistName, track);
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

export default PlaylistTrackActions;
