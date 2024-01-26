import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import { FC } from 'react';

import PlayNowButton from '../../common/Buttons/PlayNowButton';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../../lib/service-clients/playlist-client';
import Button from '../../common/Buttons/Button/Button';
import { ITrack } from '../../interface';

interface IPlaylistButtons {
  name: string,
  track: ITrack,
  index: number,
  reloadTracks: Function,
}

const PlaylistButtons: FC<IPlaylistButtons> = ({
  name,
  track,
  index,
  reloadTracks,
}) => {
  const deleteTrack = async (trackName: any, trackToDelete: any) => {
    await removeTracksFromPlaylist(trackName, [trackToDelete]);
    reloadTracks(name);
  };

  const moveTrack = async (trackToMove: any, newPosition: any) => {
    await removeTracksFromPlaylist(name, [trackToMove]);
    await addTrackAtPosition(name, trackToMove, newPosition);
    reloadTracks(name);
  };

  const button = (onClick: any, icon: any) => (
    <Button
      onClick={onClick}
      icon={icon}
    />
  );

  return (
    <>
      <PlayNowButton track={track} />
      {button(() => deleteTrack(name, track), <TrashFill />)}
      {button(() => moveTrack(track, (index - 1)), <CaretUpFill />)}
      {button(() => moveTrack(track, (index + 1)), <CaretDownFill />)}
    </>
  );
};

export default PlaylistButtons;
