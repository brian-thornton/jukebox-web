import React from 'react';
import { PropTypes } from 'prop-types';
import { ListOl } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { Track } from './shapes';
import { toastProps } from './common/toast-helper';
import './EnqueueButton.css';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function EnqueueButton({ track, isScreenSmall }) {
  return (
    <Button onClick={() => {
      enqueue(track);
      toast.success("Added to queue!", toastProps);
    }}
      content={<ListOl />} />
  );
}

EnqueueButton.defaultProps = {
  isScreenSmall: false,
};

EnqueueButton.propTypes = propTypes;

export default EnqueueButton;
