import { FC, useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueue } from '../lib/queue-client';
import { ITrack } from './interface';
import './EnqueueButton.css';
import { applyLighting } from '../lib/lightingHelper';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/styleHelper';

interface IEnqueueButton {
  mode?: string,
  track: ITrack,
  isSelected: boolean,
  onComplete?: Function,
  disabled: boolean,
};

const EnqueueButton: FC<IEnqueueButton> = ({
  track, mode, isSelected, onComplete, disabled,
}) => {
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  return (
    <Button
      disabled={disabled}
      isSelected={isSelected}
      style={{ fontSize }}
      width={heightAndWidth}
      height={heightAndWidth}
      onClick={() => {
        applyLighting(settings, 'Enqueue');
        enqueue(track);
        setTimeout(() => applyLighting(settings, mode), 700);
        if (onComplete) {
          onComplete();
        }
      }}
      content={<ListOl />}
    />
  );
};

export default EnqueueButton;
