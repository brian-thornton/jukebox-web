import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import {
  Modal as ReactModal,
} from 'react-bootstrap';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import {
  modalBodyStyle,
  modalHeaderStyle,
  modalTitleStyle,
} from '../../lib/styleHelper';

const propTypes = {
  alertText: PropTypes.string,
  content: PropTypes.node.isRequired,
  controls: PropTypes.node.isRequired,
};

function Modal({ confirmText, cancelText, isOpen, onCancel, onConfirm, title, body, size, isFooterHidden }) {
  const settings = useContext(SettingsContext);

  return (
    <ReactModal size={size} show={isOpen} onHide={onCancel}>
      <ReactModal.Header closeButton style={modalHeaderStyle(settings)}>
        <ReactModal.Title style={modalTitleStyle(settings)}>{title}</ReactModal.Title>
      </ReactModal.Header>
      <ReactModal.Body style={modalBodyStyle(settings)}>
        {body}
      </ReactModal.Body>
      {!isFooterHidden && (
        <ReactModal.Footer style={modalHeaderStyle(settings)}>
          <Button onClick={onCancel} content={cancelText || "Cancel"} />
          <Button onClick={onConfirm} content={confirmText || "Save"} />
        </ReactModal.Footer>
      )}
    </ReactModal>
  )
}


Modal.propTypes = propTypes;

export default Modal;
