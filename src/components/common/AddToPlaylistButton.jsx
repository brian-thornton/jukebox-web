import React from 'react';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import { Track } from '../shapes';
import { PlusSquare } from 'react-bootstrap-icons';

const propTypes = {
  track: Track.isRequired,
};

function AddToPlaylistButton({ track }) {
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
