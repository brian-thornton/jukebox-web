import React from 'react';
import {
  ChevronDoubleRight,
  Play,
  VolumeUp,
  VolumeDown,
  StopFill,
} from 'react-bootstrap-icons';

import { up, down } from '../../lib/volume-client';
import Button from '../Button';
import { next, stop } from '../../lib/queue-client';

const ControlButtons = () => {
  const buttons = [];
  buttons.push(<Button onClick={next} content={<Play className="volume-icon" />} />);
  buttons.push(<Button onClick={next} content={<ChevronDoubleRight className="volume-icon" />} />);
  buttons.push(<Button onClick={stop} content={<StopFill className="volume-icon" />} />);
  buttons.push(<Button onClick={up} content={<VolumeUp className="volume-icon" />} />);
  buttons.push(<Button onClick={down} content={<VolumeDown className="volume-icon" />} />);
  return buttons;
}

export default ControlButtons;
