import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { ListOl } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import Button from '../Button';
import Modal from './Modal';
import PlaylistsViewer from '../playlists/PlaylistsViewer';
import { Track } from '../shapes';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  setAddToPlaylist: PropTypes.func,
  setAddTracks: PropTypes.func,
  track: Track.isRequired,
};

function AddToPlaylistButton({ setAddTracks, setAddToPlaylist, track, isScreenSmall }) {
  const [addClicked, setAddClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          setAddTracks([track]);
          setAddToPlaylist(true);
        }}
        content="Add to Playlist"
      />
      {/* <Modal
        body={<PlaylistsViewer mode="addToPlaylist" tracks={[track]} />}
        isOpen={isOpen}
        isFooterHidden
      /> */}
    </>
  );
}

AddToPlaylistButton.defaultProps = {
  isScreenSmall: false,
};

AddToPlaylistButton.propTypes = propTypes;

export default AddToPlaylistButton;
