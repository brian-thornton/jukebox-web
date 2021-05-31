import React, { useState, useContext } from 'react';
import {
  Button,
  Card,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Album } from '../shapes';
import { saveCoverArt } from '../../lib/librarian-client';
import styles from '../styles';
import { SettingsContext } from '../layout/Jukebox';

const albumArt = require('album-art');

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  album: Album.isRequired,
};

function CoverArtSearchModal({
  isOpen,
  handleClose,
  album,
}) {
  const settings = useContext(SettingsContext);
  const [results, setResults] = useState();
  const title = 'Custom Cover Art Search';
  const [query, setQuery] = useState(album.name);
  const saveCoverArtToLibrary = () => saveCoverArt({ album, url: results });

  const handleResult = (data) => {
    if (data.toString().includes('http')) {
      setResults(data);
    }
  };

  const handleSearch = () => {
    if (query.includes('-')) {
      const nameArray = query.split('-');
      albumArt(nameArray[0], { album: nameArray[1] }).then(data => handleResult(data));
    } else {
      albumArt(query).then(data => handleResult(data));
    }
  };

  const handleSave = () => {
    saveCoverArtToLibrary();
    handleClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header style={{ background: settings.styles.headerColor }} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: settings.styles.popupBackgroundColor }}>
        <InputGroup className="mb-3">
          <FormControl
            id="name"
            placeholder="Name"
            aria-label="Name"
            defaultValue={album.name}
            aria-describedby="basic-addon1"
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={handleSearch}>Search</Button>
        <Card className="h-55 w-85 album-card-small">
          <Card.Img style={{ ...styles.albumCardLarge, width: '150px' }} top src={results} />
        </Card>
      </Modal.Body>
      <Modal.Footer style={{ background: settings.styles.footerColor }}>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

CoverArtSearchModal.propTypes = propTypes;

export default CoverArtSearchModal;
