import React from 'react';
import { PlayFill } from 'react-bootstrap-icons';

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

  return <Button style={{ marginTop: '0px' }} icon={<PlayFill />} onClick={() => playNow()} />;
}

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;
