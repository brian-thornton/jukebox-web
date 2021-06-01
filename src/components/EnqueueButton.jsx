import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { CollectionPlay } from 'react-bootstrap-icons';

import { Button } from 'react-bootstrap';
import { enqueue } from '../lib/queue-client';
import { buttonProps } from '../lib/styleHelper';
import { Track } from './shapes';
import './EnqueueButton.css';
import { SettingsContext } from './layout/Jukebox';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function EnqueueButton({ track, isScreenSmall }) {
  const settings = useContext(SettingsContext);
  const content = isScreenSmall ? <CollectionPlay /> : 'Enqueue';

  return (
    <Button {...buttonProps(settings)} onClick={() => enqueue(track)}>
      {content}
    </Button>
  );
}

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
