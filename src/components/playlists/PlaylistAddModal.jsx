import React from 'react';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import NameInput from '../common/NameInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  existingPlaylistName: PropTypes.string,
};

function PlaylistAddModal({
  isOpen,
  handleClose,
  handleSave,
  existingPlaylistName,
}) {
  const title = existingPlaylistName ? `Save Playlist '${existingPlaylistName}' as...` : 'Add Playlist';

  return (
    <Modal
      isOpen={isOpen}
      onCancel={handleClose}
      onConfirm={() => handleSave(document.getElementById('name').value)}
      title={title}
      body={<NameInput />}
    />
  );
}

PlaylistAddModal.propTypes = propTypes;

PlaylistAddModal.defaultProps = {
  existingPlaylistName: '',
};

export default PlaylistAddModal;
