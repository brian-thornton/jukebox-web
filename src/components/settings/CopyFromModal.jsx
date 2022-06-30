import Form from 'react-bootstrap/Form';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';

import Modal from '../common/Modal';
import { Colors } from '../shapes';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  colors: Colors.isRequired,
  handleCopyColor: PropTypes.func.isRequired,
};

const CopyFromModal = ({
  isOpen,
  handleHide,
  colors,
  handleCopyColor,
}) => {
  const [copiedColor, setCopiedColor] = useState();

  return (
    <Modal
      isOpen={isOpen}
      title="Copy Color From"
      onCancel={handleHide}
      body={(
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
      )}
      onConfirm={() => {
        handleCopyColor(copiedColor);
        handleHide();
      }}
    />
  );
}

CopyFromModal.propTypes = propTypes;

export default CopyFromModal;
