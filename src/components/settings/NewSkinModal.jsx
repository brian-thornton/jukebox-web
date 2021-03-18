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
  modalTitleStyle
} from '../../lib/styleHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

function NewSkinModal({ isOpen, handleHide, handleSave, settings }) {
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

NewSkinModal.propTypes = propTypes;

export default NewSkinMo;
