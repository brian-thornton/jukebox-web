import React from 'react';
import { PropTypes } from 'prop-types';
import { Play } from 'react-bootstrap-icons';

import { Button } from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import { buttonProps } from '../lib/styleHelper';
import { Track, Settings } from './shapes';
import './PlayNowButton.css';

const propTypes = {
  settings: Settings.isRequired,
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function PlayNowButton({ track, settings, isScreenSmall }) {
  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.next();
  };

  if (settings) {
    if (isScreenSmall) {
      return <Button className="play-now" {...buttonProps(settings)} onClick={() => playNow(track)}><Play /></Button>;
    } else {
      return <Button className="play-now" {...buttonProps(settings)} onClick={() => playNow(track)}>Play</Button>;
    }
  }

  return <React.Fragment />;
};

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;