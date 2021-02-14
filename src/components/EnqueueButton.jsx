import React from 'react';
import { PropTypes } from 'prop-types';
import { CollectionPlay } from 'react-bootstrap-icons';

import { Button } from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import { buttonProps } from '../lib/styleHelper';
import { Track, Settings } from './shapes';
import './EnqueueButton.css';

const propTypes = {
  settings: Settings.isRequired,
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function EnqueueButton({ track, settings, isScreenSmall }) {
  if (settings) {
    if (isScreenSmall) {
      return (
        <Button
          {...buttonProps(settings)}
          onClick={() => QueueClient.enqueue(track)}
        >
          <CollectionPlay />
        </Button>
      );
    } else {
      return (
        <Button
          {...buttonProps(settings)}
          onClick={() => QueueClient.enqueue(track)}
        >
          Enqueue
        </Button>
      );
    }
  }
};

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;