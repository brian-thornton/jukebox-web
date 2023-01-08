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

  const deleteTrack = async (trackName, trackToDelete) => {
    await removeTracksFromPlaylist(trackName, [trackToDelete]);
    reloadTracks(name);
  };

  const moveTrack = async (trackToMove, newPosition) => {
    await removeTracksFromPlaylist(name, [trackToMove]);
    await addTrackAtPosition(name, trackToMove, newPosition);
    reloadTracks(name);
  };

  const button = (onClick, icon) => (
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

PlaylistButtons.defaultProps = {
  track: null,
};

PlaylistButtons.propTypes = propTypes;

export default PlaylistButtons;
