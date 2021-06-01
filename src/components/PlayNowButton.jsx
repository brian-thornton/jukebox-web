import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Play } from 'react-bootstrap-icons';

import { Button } from 'react-bootstrap';
import { enqueueTop, next } from '../lib/queue-client';
import { buttonProps } from '../lib/styleHelper';
import { Track } from './shapes';
import './PlayNowButton.css';
import { SettingsContext } from './layout/Jukebox';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function PlayNowButton({ track, isScreenSmall }) {
  const settings = useContext(SettingsContext);
  const playContent = isScreenSmall ? <Play /> : 'Play';

  const playNow = (track) => {
    enqueueTop(track);
    next();
  };

  return <Button className="play-now" {...buttonProps(settings)} onClick={() => playNow(track)}>{playContent}</Button>;
};

PlayNowButton.propTypes = propTypes;

export default PlayNowButton;