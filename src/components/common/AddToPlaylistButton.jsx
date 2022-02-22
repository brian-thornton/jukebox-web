import React from 'react';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import { Track } from '../shapes';

const propTypes = {
  setAddToPlaylist: PropTypes.func,
  setAddTracks: PropTypes.func,
  track: Track.isRequired,
};

function AddToPlaylistButton({ setAddTracks, setAddToPlaylist, track }) {
  return (
    <>
      <Button
        style={{ marginTop: '0px' }}
        onClick={() => {
          setAddTracks([track]);
          setAddToPlaylist(true);
        }}
        content="Add to Playlist"
      />
    </>
  );
}

AddToPlaylistButton.defaultProps = {
  setAddToPlaylist: null,
  setAddTracks: null,
};

AddToPlaylistButton.propTypes = propTypes;

export default AddToPlaylistButton;
