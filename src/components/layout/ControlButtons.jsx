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
  const { features, preferences, isScreenSmall } = settings;
  const { vlcHost, vlcPort, vlcPassword } = preferences;
  const { controlButtonSize } = settings.styles;

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

  const commonProps = {
    height,
    width: height,
    disabled: features.isLocked,
  };

  return (
    <>
      {features.play && (
        <Button
          {...commonProps}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<Play style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.next && (
        <Button
          {...commonProps}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<ChevronDoubleRight style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.stop && (
        <Button
          {...commonProps}
          onClick={stopAll}
          content={<StopFill style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.volume && (
        <Button
          {...commonProps}
          onClick={up}
          content={<VolumeUp style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features.volume && (
        <Button
          {...commonProps}
          onClick={down}
          content={<VolumeDown style={{ fontSize }} className="volume-icon" />}
        />
      )}
    </>
  );
};

export default ControlButtons;
