import { FC } from 'react';
import { PlayFill } from 'react-bootstrap-icons';

import Button from './Button/Button';
import { enqueueTop, next } from '../../../lib/service-clients/queue-client';
import { ITrack } from '../../interface';

interface IPlayNowButton {
  track: ITrack,
}

const PlayNowButton: FC<IPlayNowButton> = ({ track }) => {
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Button
      icon={<PlayFill />}
      onClick={() => playNow()}
    />
  );
};

export default PlayNowButton;
