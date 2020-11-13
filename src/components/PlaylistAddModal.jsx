import React from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Settings } from './shapes';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  settings: Settings.isRequired,
  handleClose: PropTypes.func.isRequired,
  existingPlaylistName: PropTypes.string
};

function PlaylistAddModal({ isOpen, handleClose, handleSave, existingPlaylistName }) {
  const title = existingPlaylistName ? `Save Playlist '${existingPlaylistName}' as...` : 'Add Playlist';

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            id="name"
            placeholder="Name"
            aria-label="Name"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={() => handleSave(document.getElementById('name').value)}>
          Save
    </Button>
      </Modal.Footer>
    </Modal>
  );
}

PlaylistAddModal.propTypes = propTypes;

export default PlaylistAddModal;

