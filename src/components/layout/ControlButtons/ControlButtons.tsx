import { FC, useContext } from 'react';
import {
  ChevronDoubleRight,
  Play,
  VolumeUp,
  VolumeDown,
  StopFill,
} from 'react-bootstrap-icons';

import { up, down } from '../../../lib/service-clients/volume-client';
import Button from '../../Button';
import { next, stop } from '../../../lib/service-clients/queue-client';
import { SettingsContext } from '../SettingsProvider';
import { stop as radioStop } from '../../../lib/service-clients/radio-client';

interface IControlButtons {
  mediaType: string,
  setMediaType: Function,
}

const ControlButtons: FC<IControlButtons> = ({ mediaType, setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall, styles } = settings;

  let height;
  let fontSize = '';

  if (!isScreenSmall && styles?.controlButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (!isScreenSmall && styles?.controlButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  const stopAll = () => {
    stop();
    radioStop();
    setMediaType('file');
  };

  const commonProps = {
    height,
    width: height,
    disabled: features?.isLocked,
  };

  return (
    <>
      {features?.play && (
        <Button
          {...commonProps}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<Play style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features?.next && (
        <Button
          {...commonProps}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<ChevronDoubleRight style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features?.stop && (
        <Button
          {...commonProps}
          onClick={stopAll}
          content={<StopFill style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features?.volume && (
        <Button
          {...commonProps}
          onClick={up}
          content={<VolumeUp style={{ fontSize }} className="volume-icon" />}
        />
      )}
      {features?.volume && (
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
