import React from 'react';
import { PropTypes } from 'prop-types';
import { CollectionPlay } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import './EnqueueButton.css';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function EnqueueButton({ track, isScreenSmall }) {
  const content = isScreenSmall ? <CollectionPlay /> : 'Enqueue';

  return (
    <Button onClick={() => enqueue(track)} content={content} />
  );
}

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
