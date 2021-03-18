import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Colors } from '../shapes';

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
  colors: Colors.isRequired,
  handleCopyColor: PropTypes.func.isRequired,
};

function CopyFromModal({
  isOpen,
  handleHide,
  colors,
  handleCopyColor,
  settings,
}) {
  const [copiedColor, setCopiedColor] = useState();

  return (
    <Modal show={isOpen} onHide={handleHide}>
      <Modal.Header style={modalHeaderStyle(settings)} closeButton>
        <Modal.Title style={modalTitleStyle(settings)}>Copy Color From</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)}>
        <Form.Group>
          <Form.Control as="select" size="lg" onChange={event => setCopiedColor(event.target.value)}>
            <option value={colors.headerColor}>Header Color</option>
            <option value={colors.footerColor}>Footer Color</option>
            <option value={colors.fontColor}>Font Color</option>
            <option value={colors.backgroundColor}>Background Color</option>
            <option value={colors.popupBackgroundColor}>Popup Background Color</option>
            <option value={colors.buttonBackgroundColor}>Button Background Color</option>
            <option value={colors.buttonTextColor}>Button Text Color</option>
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle(settings)}>
        <Button {...buttonProps(settings)} onClick={handleHide}>Close</Button>
        <Button {...buttonProps(settings)}
          onClick={() => {
            handleCopyColor(copiedColor);
            handleHide();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CopyFromModal.propTypes = propTypes;

export default CopyFromModal;
