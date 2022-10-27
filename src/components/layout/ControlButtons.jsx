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
import { stop as radioStop } from '../../lib/radio-client';

const ControlButtons = ({ mediaType, setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const { vlcHost, vlcPort, vlcPassword } = preferences;

  const stopAll = () => {
    stop(vlcHost, vlcPort, vlcPassword);
    radioStop();
    setMediaType('file');
  };

  return (
    <>
      {settings.features.play && <Button disabled={settings.features.isLocked || mediaType !== 'file'} onClick={next} content={<Play className="volume-icon" />} />}
      {settings.features.next && <Button disabled={settings.features.isLocked || mediaType !== 'file'} onClick={next} content={<ChevronDoubleRight className="volume-icon" />} />}
      {settings.features.stop && <Button disabled={settings.features.isLocked} onClick={stopAll} content={<StopFill className="volume-icon" />} />}
      {settings.features.volume && <Button disabled={settings.features.isLocked} onClick={up} content={<VolumeUp className="volume-icon" />} />}
      {settings.features.volume && <Button disabled={settings.features.isLocked} onClick={down} content={<VolumeDown className="volume-icon" />} />}
    </>
  )
}

export default ControlButtons;
