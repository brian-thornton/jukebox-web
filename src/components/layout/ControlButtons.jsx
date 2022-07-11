import React, { useContext } from 'react';
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
import { SettingsContext } from './SettingsProvider';

const ControlButtons = () => {
  const settings = useContext(SettingsContext);

  return (
    <>
      {settings.features.play && <Button onClick={next} content={<Play className="volume-icon" />} />}
      {settings.features.next && <Button onClick={next} content={<ChevronDoubleRight className="volume-icon" />} />}
      {settings.features.stop && <Button onClick={stop} content={<StopFill className="volume-icon" />} />}
      {settings.features.volume && <Button onClick={up} content={<VolumeUp className="volume-icon" />} />}
      {settings.features.volume && <Button onClick={down} content={<VolumeDown className="volume-icon" />} />}
    </>
  )
}

export default ControlButtons;
