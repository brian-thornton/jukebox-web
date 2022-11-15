import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import React, { useContext } from 'react';

import PlayNowButton from '../PlayNowButton';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';
import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';

const PlaylistButtons = ({ name, track, index, reloadTracks }) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';

  const deleteTrack = (trackName, track) => {
    removeTracksFromPlaylist(trackName, [track]);
    reloadTracks(name);
  };

  const onMoveTrackUp = (trackToMove, index) => {
    removeTracksFromPlaylist(name, [trackToMove]);
    addTrackAtPosition(name, trackToMove, index - 1);
    reloadTracks(name);
  };

  const onMoveTrackDown = (trackToMove, index) => {
    removeTracksFromPlaylist(name, [trackToMove]).then(() => {
      addTrackAtPosition(name, trackToMove, index + 1);
      reloadTracks(name);
    });
  };

  return (
    <>
      <PlayNowButton track={track} />
      <Button height={buttonHeight} width={buttonWidth} onClick={() => deleteTrack(name, track)} icon={<TrashFill />} />
      <Button height={buttonHeight} width={buttonWidth} icon={<CaretUpFill />} onClick={() => onMoveTrackUp(track, index)} />
      <Button height={buttonHeight} width={buttonWidth} icon={<CaretDownFill />} onClick={() => onMoveTrackDown(track, index)} />
    </>
  )
};

export default PlaylistButtons;