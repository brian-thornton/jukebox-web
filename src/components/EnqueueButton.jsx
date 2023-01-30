import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import './EnqueueButton.css';
import { applyLighting } from '../lib/lightingHelper';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/styleHelper';

const propTypes = {
  mode: PropTypes.string,
  track: Track.isRequired,
  isSelected: PropTypes.bool,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool,
};

const EnqueueButton = ({
  track, mode, isSelected, onComplete, disabled,
}) => {
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  return (
    <Button
      disabled={disabled}
      isSelected={isSelected}
      style={{ fontSize }}
      width={heightAndWidth}
      height={heightAndWidth}
      onClick={() => {
        applyLighting(settings, 'Enqueue');
        enqueue(track);
        setTimeout(() => applyLighting(settings, mode), 700);
        if (onComplete) {
          onComplete();
        }
      }}
      content={<ListOl />}
    />
  );
};

EnqueueButton.defaultProps = {
  mode: '',
  isSelected: false,
  onComplete: false,
  disabled: false,
};

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
