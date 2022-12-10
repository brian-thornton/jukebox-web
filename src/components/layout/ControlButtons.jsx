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
  const { features } = settings;
  const { vlcHost, vlcPort, vlcPassword } = preferences;
  const { controlButtonSize } = settings.styles;
  const isScreenSmall = window.innerWidth < 700;

  let height;
  let fontSize = '';

  if (!isScreenSmall && controlButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (!isScreenSmall && controlButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  const stopAll = () => {
    stop(vlcHost, vlcPort, vlcPassword);
    radioStop();
    setMediaType('file');
  };

  return (
    <>
      {features.play && (
        <Button
          height={height}
          width={height}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<Play style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.next && (
        <Button
          height={height}
          width={height}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<ChevronDoubleRight style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.stop && (
        <Button
          height={height}
          width={height}
          disabled={features.isLocked}
          onClick={stopAll}
          content={<StopFill style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.volume && (
        <Button
          height={height}
          width={height}
          disabled={features.isLocked}
          onClick={up}
          content={<VolumeUp style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.volume && (
        <Button
          height={height}
          width={height}
          disabled={features.isLocked}
          onClick={down}
          content={<VolumeDown style={{ fontSize }} className="volume-icon" />}
        />
      )}
    </>
  );
};

export default ControlButtons;
