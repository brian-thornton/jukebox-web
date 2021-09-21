import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import {
  modalBodyStyle,
  modalHeaderStyle,
  modalTitleStyle,
  modalFooterStyle,
} from '../../lib/styleHelper';
import { SettingsContext } from '../layout/Jukebox';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

function ConfirmationModal({ confirmText, isOpen, onConfirm, onCancel, body, title }) {
  const settings = useContext(SettingsContext);

  return (
    <Modal show={isOpen} onHide={onCancel}>
      <Modal.Header closeButton style={modalHeaderStyle(settings)}>
        <Modal.Title style={modalTitleStyle(settings)}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)}>
        {body}
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle(settings)}>
        <Button variant="secondary" onClick={onCancel} style={{ fontFamily: settings.styles.buttonFont }}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm} style={{ fontFamily: settings.styles.buttonFont }}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmationModal.propTypes = propTypes;

export default ConfirmationModal;
