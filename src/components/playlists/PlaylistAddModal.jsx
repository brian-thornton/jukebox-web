import React, { useContext } from 'react';
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { SettingsContext } from '../layout/Jukebox';
import { modalFooterStyle, modalHeaderStyle } from '../../lib/styleHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  existingPlaylistName: PropTypes.string,
};

function PlaylistAddModal({
  isOpen,
  handleClose,
  handleSave,
  existingPlaylistName,
}) {
  const settings = useContext(SettingsContext);
  const title = existingPlaylistName ? `Save Playlist '${existingPlaylistName}' as...` : 'Add Playlist';

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton style={modalHeaderStyle(settings)}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: settings.styles.popupBackgroundColor }}>
        <InputGroup className="mb-3">
          <FormControl
            id="name"
            placeholder="Name"
            aria-label="Name"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer style={modalHeaderStyle(settings)}>
        <Button
          variant="secondary"
          onClick={handleClose}
          style={{ fontFamily: settings.styles.buttonFont }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave(document.getElementById('name').value)}
          style={{ fontFamily: settings.styles.buttonFont }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

PlaylistAddModal.propTypes = propTypes;

PlaylistAddModal.defaultProps = {
  existingPlaylistName: '',
};

export default PlaylistAddModal;
