import React from 'react';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import NameInput from '../common/NameInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

function LibraryAddModal({
  isOpen,
  handleHide,
  handleSave,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onCancel={handleHide}
      onConfirm={handleSave}
      title="Add Library"
      body={<NameInput />}
    />
  );
}

LibraryAddModal.propTypes = propTypes;

export default LibraryAddModal;
