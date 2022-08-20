import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import React from 'react';

import PlayNowButton from '../PlayNowButton';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';
import Button from '../Button';

const PlaylistButtons = ({ name, track, index, reloadTracks }) => {
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
      <Button onClick={() => deleteTrack(name, track)} icon={<TrashFill />} />
      <Button icon={<CaretUpFill />} onClick={() => onMoveTrackUp(track, index)} />
      <Button icon={<CaretDownFill />} onClick={() => onMoveTrackDown(track, index)} />
    </>
  )
};

export default PlaylistButtons;