import React, { useContext } from 'react';
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from './Button';
import { SettingsContext } from './layout/SettingsProvider';
import { Album } from './shapes';

const propTypes = {
  album: Album.isRequired,
};

const GoToAlbumButton = ({ album }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;

  let heightAndWidth = '';

  if (controlButtonSize === 'large') {
    heightAndWidth = '60';
  }

  if (controlButtonSize === 'medium') {
    heightAndWidth = '60';
  }

  return (
    <Button
      width={heightAndWidth}
      height={heightAndWidth}
      hideOnLarge
      icon={<MusicNoteBeamed />}
      onClick={() => navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: '/tracks' } })}
    />
  );
};

GoToAlbumButton.propTypes = propTypes;

export default GoToAlbumButton;
