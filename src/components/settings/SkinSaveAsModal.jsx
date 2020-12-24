import React from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import StyleClient from '../../lib/style-client';
import { Colors } from '../shapes';

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
  const handleSave = () => {
    StyleClient.createSkin({ name: document.getElementById('name').value, skin: { ...colors, name: document.getElementById('name').value } });
    handleHide();
    goBackToThemeList();
  };

  return (
    <Modal show={isOpen} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Library</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            id="name"
            placeholder="Skin Name"
            aria-label="name"
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

SkinSaveAsModal.propTypes = propTypes;

export default SkinSaveAsModal;
