import { FC, useContext } from 'react';
import { PlayFill } from 'react-bootstrap-icons';

import Button from './Button';
import { enqueueTop, next } from '../lib/service-clients/queue-client';
import { ITrack } from './interface';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/helper/styleHelper';

interface IPlayNowButton {
  track: ITrack,
}

const PlayNowButton: FC<IPlayNowButton> = ({ track }) => {
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Button
      height={heightAndWidth}
      width={heightAndWidth}
      style={{ fontSize }}
      icon={<PlayFill />}
      onClick={() => playNow()}
    />
  );
};

export default PlayNowButton;
