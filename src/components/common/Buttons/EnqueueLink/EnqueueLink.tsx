import { FC, useContext } from 'react';

import { enqueue } from '../../../../lib/service-clients/queue-client';
import { ITrack } from '../../../interface';
import { applyLighting } from '../../../../lib/helper/lightingHelper';
import { SettingsContext } from '../../../layout/SettingsProvider';
import styles from './EnqueueLink.module.css'

interface IEnqueueLink {
  mode?: string,
  track: ITrack,
  isSelected?: boolean,
  onComplete?: Function,
  disabled?: boolean,
}

const EnqueueLink: FC<IEnqueueLink> = ({
  track, mode, onComplete
}) => {
  const settings = useContext(SettingsContext);

  return (
    <div
      className={styles.enqueueLink}
      onClick={() => {
        applyLighting(settings, 'Enqueue');
        enqueue(track);
        setTimeout(() => applyLighting(settings, mode), 700);
        if (onComplete) {
          onComplete();
        }
      }}
    >
      Add to Queue
    </div>
  );
};

export default EnqueueLink;
