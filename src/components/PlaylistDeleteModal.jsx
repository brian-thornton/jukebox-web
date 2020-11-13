import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  existingPlaylistName: PropTypes.string
};

function PlaylistDeleteModal({ isOpen, handleClose, handleDelete }) {
  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Playlist?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure that you want to delete the playlist?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>No</Button>
        <Button variant="primary" onClick={handleDelete}>
          Yes
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

PlaylistDeleteModal.propTypes = propTypes;

export default PlaylistDeleteModal;

