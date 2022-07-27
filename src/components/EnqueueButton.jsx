import React, { useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import { toastProps } from './common/toast-helper';
import './EnqueueButton.css';
import { applyLighting } from '../lib/lightingHelper';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  track: Track.isRequired,
};

const EnqueueButton = ({ track, mode }) => {
  const settings = useContext(SettingsContext);

  return (
    <Button
      onClick={() => {
        applyLighting(settings, 'Enqueue');
        enqueue(track);
        toast.success("Added to queue!", toastProps);
        setTimeout(() => applyLighting(settings, mode), 700);
      }}
      content={<ListOl />} />
  );
};

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
