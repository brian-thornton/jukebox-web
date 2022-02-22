import React from 'react';
import { ListOl } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import { toastProps } from './common/toast-helper';
import './EnqueueButton.css';

const propTypes = {
  track: Track.isRequired,
};

function EnqueueButton({ track }) {
  return (
    <Button
      style={{ marginTop: '0px' }}
      onClick={() => {
        enqueue(track);
        toast.success("Added to queue!", toastProps);
      }}
      content={<ListOl />} />
  );
}

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
