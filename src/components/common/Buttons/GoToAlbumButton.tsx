import { FC } from 'react';
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from './Button/Button';
import { IAlbum } from '../../interface';

interface IGoToAlbumButton {
  album?: IAlbum,
}

const GoToAlbumButton:FC<IGoToAlbumButton> = ({ album }) => {
  const navigate = useNavigate();

  return (
    <Button
      icon={<MusicNoteBeamed />}
      onClick={() => navigate(`/albums/${album?.id}`, { state: { currentAlbum: album, prevUrl: '/tracks' } })}
    />
  );
};

export default GoToAlbumButton;
