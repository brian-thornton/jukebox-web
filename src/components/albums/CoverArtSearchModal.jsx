import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { Album } from '../shapes';
import Button from '../Button';
import NameInput from '../common/NameInput';
import Modal from '../common/Modal';
import { saveCoverArt } from '../../lib/librarian-client';
import styles from '../styles';

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
    <Modal
      isOpen={isOpen}
      title={title}
      body={(
        <>
          <NameInput defaultValue={album.name} onChange={e => setQuery(e.target.value)} />
          <Button onClick={handleSearch} content="Search" />
          <Card className="h-55 w-85 album-card-small">
            <Card.Img style={{ ...styles.albumCardLarge, width: '150px' }} top src={results} />
          </Card>
        </>
      )}
      onCancel={handleClose}
      onConfirm={handleSave}
    />
  );
}

CoverArtSearchModal.propTypes = propTypes;

export default CoverArtSearchModal;
