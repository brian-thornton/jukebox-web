import React from 'react';
import { Play } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueueTop, next } from '../lib/queue-client';
import { Track } from './shapes';
import './PlayNowButton.css';

const propTypes = {
  track: Track.isRequired,
};

function PlayNowButton({ track }) {
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return <Button icon={<Play />} onClick={() => playNow()} content="Play" />;
}

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;
