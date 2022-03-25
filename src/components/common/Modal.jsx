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
  body: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  isFooterHidden: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
};

function Modal({
  body,
  cancelText,
  confirmText,
  isFooterHidden,
  isOpen,
  onCancel,
  onConfirm,
  size,
  title,
}) {
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
          {onCancel && (<Button onClick={onCancel} content={cancelText || 'Cancel'} />)}
          {onConfirm && (<Button onClick={onConfirm} content={confirmText || 'Save'} />)}
        </ReactModal.Footer>
      )}
    </ReactModal>
  );
}

Modal.defaultProps = {
  body: '',
  cancelText: '',
  confirmText: '',
  isFooterHidden: false,
  isOpen: false,
  onConfirm: null,
  size: '',
  title: '',
};

Modal.propTypes = propTypes;

export default Modal;
