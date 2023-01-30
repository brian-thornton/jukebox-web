import { PlusSquare } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import { Track } from '../shapes';
import { bigButtons } from '../../lib/styleHelper';

const propTypes = {
  track: Track.isRequired,
};

const AddToPlaylistButton = ({ track }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  return (
    <>
      <Button
        style={{ fontSize }}
        width={heightAndWidth}
        height={heightAndWidth}
        onClick={() => {
          navigate('/playlists', { state: { tracks: [track] } });
        }}
        icon={<PlusSquare />}
      />
    </>
  );
};

AddToPlaylistButton.propTypes = propTypes;

export default AddToPlaylistButton;
