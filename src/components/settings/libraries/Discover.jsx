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
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const Discover = ({
  handleHide,
  handleSave,
}) => {
  const settings = useContext(SettingsContext);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState();
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
      <Card.Title>Discover</Card.Title>
      <Card.Body>
        <Container fluid>
          <Row>
            <NameInput placeholder="Path" />
          </Row>
          <Row>
            <CategoryPicker
              onSelectCategory={category => setSelectedCategory(category)}
              category={selectedCategory}
            />
          </Row>
          <Row>
            <DownloadCoverArtPicker onSelect={onSelectDownloadPreference} />
          </Row>
          <Row>
            <Button content="Cancel" onClick={handleHide} />
            <Button content="Save" disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

Discover.propTypes = propTypes;

export default Discover;
