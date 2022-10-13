import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import CategoryPicker from './CategoryPicker';
import DownloadCoverArtPicker from './DownloadCoverArtPreference';
import NameInput from '../../common/NameInput';
import { SettingsContext } from '../../layout/SettingsProvider';
import './LibraryAdd.scss';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const LibraryAdd = ({
  setShow,
  setSelectedLibrary,
  handleSave,
  library,
}) => {
  const settings = useContext(SettingsContext);
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [downloadCoverArtDirty, setDownloadCoverArtDirty] = useState(false);
  const isScreenSmall = window.innerWidth < 700;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  const onSelectDownloadPreference = (value) => {
    setAllowCoverArtDownload(value);
    setDownloadCoverArtDirty(true);
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Title>{library ? 'Edit Library' : 'Add Library'}</Card.Title>
      <Card.Body>
        <Container fluid style={{ width: '100%' }}>
          <Row>
            <NameInput placeholder={library?.path} />
          </Row>
          <Row>
            <CategoryPicker onSelectCategory={(category) => setSelectedCategory(category)} category={selectedCategory} />
          </Row>
          <Row>
            <DownloadCoverArtPicker onSelect={onSelectDownloadPreference} />
          </Row>
        </Container>
        <Button content="Cancel" onClick={() => {
          setShow(false);
          setSelectedLibrary(null);
        }} />
        <Button content="Save" disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
      </Card.Body>
    </Card>
  );
}

LibraryAdd.propTypes = propTypes;

export default LibraryAdd;
