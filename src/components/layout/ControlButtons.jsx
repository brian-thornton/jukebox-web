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
  const { controlButtonSize } = settings.styles;

  let height;
  let fontSize = '';

  if (controlButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (controlButtonSize === 'medium') {
    height = '80'
    fontSize = '40px';
  }

  const stopAll = () => {
    stop(vlcHost, vlcPort, vlcPassword);
    radioStop();
    setMediaType('file');
  };

  return (
    <>
      {settings.features.play && <Button height={height} width={height} disabled={settings.features.isLocked || mediaType !== 'file'} onClick={next} content={<Play style={{ fontSize }} className="volume-icon" />} />}
      {settings.features.next && <Button height={height} width={height} disabled={settings.features.isLocked || mediaType !== 'file'} onClick={next} content={<ChevronDoubleRight style={{ fontSize }} className="volume-icon" />} />}
      {settings.features.stop && <Button height={height} width={height} disabled={settings.features.isLocked} onClick={stopAll} content={<StopFill style={{ fontSize }} className="volume-icon" />} />}
      {settings.features.volume && <Button height={height} width={height} disabled={settings.features.isLocked} onClick={up} content={<VolumeUp style={{ fontSize }} className="volume-icon" />} />}
      {settings.features.volume && <Button height={height} width={height} disabled={settings.features.isLocked} onClick={down} content={<VolumeDown style={{ fontSize }} className="volume-icon" />} />}
    </>
  )
}

export default ControlButtons;
