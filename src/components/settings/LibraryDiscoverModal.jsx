import React from 'react';
import { FormControl } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import NameInput from '../common/NameInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleHide: PropTypes.func.isRequired,
};

function LibraryDiscoverModal({
  isOpen,
  handleHide,
  handleSave,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onCancel={handleHide}
      onConfirm={handleSave}
      title="Discover"
      body={<NameInput />}
    />
  );
}

LibraryDiscoverModal.propTypes = propTypes;

export default LibraryDiscoverModal;
