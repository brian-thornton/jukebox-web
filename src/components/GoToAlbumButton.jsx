import React from 'react';
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from './Button';

const GoToAlbumButton = ({ album }) => {
  const navigate = useNavigate();
  return (
    <Button
      hideOnLarge
      icon={<MusicNoteBeamed />}
      onClick={() => navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: '/tracks' } })}
    />
  );
}

export default GoToAlbumButton;
