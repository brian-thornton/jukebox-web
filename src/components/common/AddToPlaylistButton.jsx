import { PlusSquare } from 'react-bootstrap-icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import { Track } from '../shapes';

const propTypes = {
  track: Track.isRequired,
};

const AddToPlaylistButton = ({ track }) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
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
