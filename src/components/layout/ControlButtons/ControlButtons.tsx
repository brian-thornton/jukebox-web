import { FC, useContext } from 'react';
import {
  ChevronDoubleRight,
  Play,
  VolumeUp,
  VolumeDown,
  StopFill,
} from 'react-bootstrap-icons';

import { up, down } from '../../../lib/service-clients/volume-client';
import Button from '../../common/Buttons/Button/Button';
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

  if (!isScreenSmall && styles?.controlButtonSize === 'large') {
    height = '100';
  }

  if (!isScreenSmall && styles?.controlButtonSize === 'medium') {
    height = '70';
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
          content={<Play className="volume-icon" />}
        />
      )}
      {features?.next && (
        <Button
          {...commonProps}
          disabled={features.isLocked || mediaType !== 'file'}
          onClick={next}
          content={<ChevronDoubleRight className="volume-icon" />}
        />
      )}
      {features?.stop && (
        <Button
          {...commonProps}
          onClick={stopAll}
          content={<StopFill className="volume-icon" />}
        />
      )}
      {features?.volume && (
        <Button
          {...commonProps}
          onClick={up}
          content={<VolumeUp className="volume-icon" />}
        />
      )}
      {features?.volume && (
        <Button
          {...commonProps}
          onClick={down}
          content={<VolumeDown className="volume-icon" />}
        />
      )}
    </>
  );
};

export default ControlButtons;
