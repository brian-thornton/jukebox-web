import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import { FC, useContext } from 'react';

import PlayNowButton from '../../PlayNowButton';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../../lib/service-clients/playlist-client';
import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack } from '../../interface';
import { bigButtons } from '../../../lib/helper/styleHelper';

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
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const fontSize = bigButtons(settings) ? '30px' : '';

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
      style={{ fontSize }}
      height={buttonHeight}
      width={buttonWidth}
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
