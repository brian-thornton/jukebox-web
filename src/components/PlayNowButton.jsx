import React, { useContext } from 'react';
import { PlayFill } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueueTop, next } from '../lib/queue-client';
import { Track } from './shapes';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  track: Track.isRequired,
};

const PlayNowButton = ({ track }) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;

  let heightAndWidth = '';

  if (controlButtonSize === 'large') {
    heightAndWidth = '60';
  }

  if (controlButtonSize === 'medium') {
    heightAndWidth = '60';
  }

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Button
      height={heightAndWidth}
      width={heightAndWidth}
      icon={<PlayFill />}
      onClick={() => playNow()}
    />
  );
};

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;
