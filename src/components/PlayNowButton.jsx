import React, { useContext } from 'react';
import { PlayFill } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueueTop, next } from '../lib/queue-client';
import { Track } from './shapes';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/styleHelper';

const propTypes = {
  track: Track.isRequired,
};

const PlayNowButton = ({ track }) => {
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Button
      height={heightAndWidth}
      width={heightAndWidth}
      style={{ fontSize }}
      icon={<PlayFill />}
      onClick={() => playNow()}
    />
  );
};

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;
