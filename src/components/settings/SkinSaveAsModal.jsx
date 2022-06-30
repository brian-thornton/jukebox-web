import React from 'react';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import { createSkin } from '../../lib/style-client';
import { Colors } from '../shapes';
import NameInput from '../common/NameInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  colors: Colors.isRequired,
  goBackToThemeList: PropTypes.func.isRequired,
};

const SkinSaveAsModal = ({
  goBackToThemeList,
  isOpen,
  handleHide,
  colors,
}) => {
  const handleSave = () => {
    createSkin({ name: document.getElementById('name').value, skin: { ...colors, isEditable: true, name: document.getElementById('name').value } });
    handleHide();
    goBackToThemeList();
  };

  return (
    <Modal
      isOpen={isOpen}
      onCancel={handleHide}
      onConfirm={handleSave}
      title="Save a Copy of Skin As..."
      body={<NameInput />}
    />
  );
}

SkinSaveAsModal.propTypes = propTypes;

export default SkinSaveAsModal;
