import React from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import {
  buttonProps,
  modalBodyStyle,
  modalFooterStyle,
  modalHeaderStyle,
  modalTitleStyle,
} from '../../lib/styleHelper';
import { Settings } from '../shapes';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function LibraryAddModal({
  isOpen,
  handleHide,
  handleSave,
  settings,
}) {
  return (
    <Modal show={isOpen} onHide={handleHide}>
      <Modal.Header closeButton style={modalHeaderStyle(settings)}>
        <Modal.Title style={modalTitleStyle(settings)}>Add Library</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)}>
        <InputGroup className="mb-3">
          <FormControl
            id="path"
            placeholder="Path"
            aria-label="Path"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle(settings)}>
        <Button {...buttonProps(settings)} onClick={handleHide}>Close</Button>
        <Button {...buttonProps(settings)} onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

LibraryAddModal.propTypes = propTypes;

export default LibraryAddModal;
