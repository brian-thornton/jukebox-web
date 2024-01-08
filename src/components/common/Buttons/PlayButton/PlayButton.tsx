import { FC, useContext } from 'react';
import { PlayFill } from 'react-bootstrap-icons';

import { enqueueTracksTop, next } from '../../../../lib/service-clients/queue-client';
import Button from '../../../common/Button/Button';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { ITrack } from '../../../../components/interface';

interface IPlayButton {
  tracks: Array<ITrack>,
}

const PlayButton: FC<IPlayButton> = ({tracks}) => {
  const settings = useContext(SettingsContext);
  const { features } = settings || {};

  const playAlbum = () => {
    enqueueTracksTop(tracks);
    next();
  };

  return (
    <div>
      {features?.play && (
        <Button
          icon={<PlayFill />}
          onClick={playAlbum}
        />
      )}
    </div>
  );
};

export default PlayButton;
