import { FC, useContext } from 'react';
import { ListOl } from 'react-bootstrap-icons';

import { enqueueTracks } from '../../../../lib/service-clients/queue-client';
import Button from '../Button/Button';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { ITrack } from '../../../../components/interface';

interface IEnqueueButton {
  tracks: Array<ITrack>,
}

const EnqueueButton: FC<IEnqueueButton> = ({tracks}) => {
  const settings = useContext(SettingsContext);
  const { features } = settings || {};

  return (
    <div>
      {features?.play && (
        <Button
          icon={<ListOl />}
          onClick={() => enqueueTracks(tracks)}
        />
      )}
    </div>
  );
};

export default EnqueueButton;
