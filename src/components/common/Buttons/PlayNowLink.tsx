import { FC } from 'react';

import { enqueueTop, next } from '../../../lib/service-clients/queue-client';
import { ITrack } from '../../interface';

interface IPlayNowLink {
  track: ITrack,
}

const PlayNowLink: FC<IPlayNowLink> = ({ track }) => {
  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <div onClick={() => playNow()}>
      Play Now
    </div>
  );
};

export default PlayNowLink;
