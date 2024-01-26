import { FC, useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';

import Button from './Button/Button';
import { enqueue } from '../../../lib/service-clients/queue-client';
import { ITrack } from '../../interface';
import { applyLighting } from '../../../lib/helper/lightingHelper';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IEnqueueButton {
  mode?: string,
  track: ITrack,
  isSelected?: boolean,
  onComplete?: Function,
  disabled?: boolean,
}

const EnqueueButton: FC<IEnqueueButton> = ({
  track, mode, isSelected, onComplete, disabled,
}) => {
  const settings = useContext(SettingsContext);

  return (
    <Button
      disabled={disabled}
      isSelected={isSelected}
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
