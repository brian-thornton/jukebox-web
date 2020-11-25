import React from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

function LibraryAddModal({ isOpen, handleHide, handleSave }) {
  return (
    <Modal show={isOpen} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Library</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            id="path"
            placeholder="Path"
            aria-label="Path"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

LibraryAddModal.propTypes = propTypes;

export default LibraryAddModal;
