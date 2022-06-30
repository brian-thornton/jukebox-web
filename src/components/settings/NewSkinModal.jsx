import React from 'react';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import NameInput from '../common/NameInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const NewSkinModal = ({
  isOpen,
  handleHide,
  handleSave,
}) => (
  <Modal
    isOpen={isOpen}
    onCancel={handleHide}
    onConfirm={handleSave}
    body={<NameInput />}
  />
);

NewSkinModal.propTypes = propTypes;

export default NewSkinModal;
