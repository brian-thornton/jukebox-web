import { FC, useContext } from 'react';
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from './Button';
import { SettingsContext } from './layout/SettingsProvider';
import { IAlbum } from './interface';
import { bigButtons } from '../lib/helper/styleHelper';

interface IGoToAlbumButton {
  album?: IAlbum,
}

const GoToAlbumButton:FC<IGoToAlbumButton> = ({ album }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';

  return (
    <Button
      width={heightAndWidth}
      height={heightAndWidth}
      icon={<MusicNoteBeamed />}
      onClick={() => navigate(`/albums/${album?.id}`, { state: { currentAlbum: album, prevUrl: '/tracks' } })}
    />
  );
};

export default GoToAlbumButton;
