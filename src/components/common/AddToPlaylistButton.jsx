import { PlusSquare } from 'react-bootstrap-icons';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../../components/layout/SettingsProvider';

import Button from '../Button';
import { Track } from '../shapes';

const propTypes = {
  track: Track.isRequired,
};

const AddToPlaylistButton = ({ track }) => {
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
    <>
      <Button
        width={heightAndWidth}
        height={heightAndWidth}
        onClick={() => {
          navigate('/playlists', { state: { tracks: [track] } })
        }}
        icon={<PlusSquare />}
      />
    </>
  );
}

AddToPlaylistButton.propTypes = propTypes;

export default AddToPlaylistButton;
