import React, { useContext } from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { createSkin } from '../../lib/style-client';
import { Colors } from '../shapes';
import { SettingsContext } from '../layout/Jukebox';

import {
  buttonProps,
  modalBodyStyle,
  modalFooterStyle,
  modalHeaderStyle,
  modalTitleStyle,
} from '../../lib/styleHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  colors: Colors.isRequired,
  goBackToThemeList: PropTypes.func.isRequired,
};

function SkinSaveAsModal({
  goBackToThemeList,
  isOpen,
  handleHide,
  colors,
}) {
  const settings = useContext(SettingsContext);
  const handleSave = () => {
    createSkin({ name: document.getElementById('name').value, skin: { ...colors, isEditable: true, name: document.getElementById('name').value } });
    handleHide();
    goBackToThemeList();
  };

  return (
    <Modal show={isOpen} onHide={handleHide}>
      <Modal.Header closeButton style={modalHeaderStyle(settings)}>
        <Modal.Title style={modalTitleStyle(settings)}>Save a Copy of Skin As...</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)}>
        <InputGroup className="mb-3">
          <FormControl
            id="name"
            placeholder="Skin Name"
            aria-label="name"
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

SkinSaveAsModal.propTypes = propTypes;

export default SkinSaveAsModal;
