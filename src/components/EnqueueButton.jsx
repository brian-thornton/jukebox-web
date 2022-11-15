import React, { useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import './EnqueueButton.css';
import { applyLighting } from '../lib/lightingHelper';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  track: Track.isRequired,
};

const EnqueueButton = ({ track, mode }) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;

  let heightAndWidth = '';

  if (controlButtonSize === 'large') {
    heightAndWidth = '60';
  }

  if (controlButtonSize === 'medium') {
    heightAndWidth = '60';
  }

  return (
    <Button
      width={heightAndWidth}
      height={heightAndWidth}
      onClick={() => {
        applyLighting(settings, 'Enqueue');
        enqueue(track);
        setTimeout(() => applyLighting(settings, mode), 700);
      }}
      content={<ListOl />} />
  );
};

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
