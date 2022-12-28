import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import PlayNowButton from '../PlayNowButton';
import {
  addTrackAtPosition,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';
import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import { Track } from '../shapes';

const propTypes = {
  name: PropTypes.string.isRequired,
  track: Track,
  index: PropTypes.number.isRequired,
  reloadTracks: PropTypes.func.isRequired,
};

const PlaylistButtons = ({
  name,
  track,
  index,
  reloadTracks,
}) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const fontSize = ['large', 'medium'].includes(controlButtonSize) ? '30px' : '';

  const deleteTrack = (trackName, trackToDelete) => {
    removeTracksFromPlaylist(trackName, [trackToDelete]);
    reloadTracks(name);
  };

  const onMoveTrackUp = (trackToMove, trackIndex) => {
    removeTracksFromPlaylist(name, [trackToMove]);
    addTrackAtPosition(name, trackToMove, trackIndex - 1);
    reloadTracks(name);
  };

  const onMoveTrackDown = (trackToMove, trackIndex) => {
    removeTracksFromPlaylist(name, [trackToMove]).then(() => {
      addTrackAtPosition(name, trackToMove, trackIndex + 1);
      reloadTracks(name);
    });
  };

  return (
    <>
      <PlayNowButton track={track} />
      <Button
        style={{ fontSize }}
        height={buttonHeight}
        width={buttonWidth}
        onClick={() => deleteTrack(name, track)}
        icon={<TrashFill />}
      />
      <Button
        style={{ fontSize }}
        height={buttonHeight}
        width={buttonWidth}
        icon={<CaretUpFill />}
        onClick={() => onMoveTrackUp(track, index)}
      />
      <Button
        style={{ fontSize }}
        height={buttonHeight}
        width={buttonWidth}
        icon={<CaretDownFill />}
        onClick={() => onMoveTrackDown(track, index)}
      />
    </>
  );
};

PlaylistButtons.defaultProps = {
  track: null,
};

PlaylistButtons.propTypes = propTypes;

export default PlaylistButtons;
