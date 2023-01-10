import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

import Button from '../../Button';
import CategoryPicker from './CategoryPicker';
import DownloadCoverArtPicker from './DownloadCoverArtPreference';
import NameInput from '../../common/NameInput';
import { SettingsContext } from '../../layout/SettingsProvider';
import './LibraryAdd.scss';
import { Library } from '../../shapes';

const propTypes = {
  setShow: PropTypes.func,
  setSelectedLibrary: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  library: Library,
};

const LibraryAdd = ({
  intl,
  setShow,
  setSelectedLibrary,
  handleSave,
  library,
}) => {
  const settings = useContext(SettingsContext);
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [downloadCoverArtDirty, setDownloadCoverArtDirty] = useState(false);
  const { isScreenSmall } = settings;

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
      <Card.Title>{library ? intl.formatMessage({ id: 'edit_library' }) : intl.formatMessage({ id: 'add_library' })}</Card.Title>
      <Card.Body>
        <Container fluid className="addContainer">
          <Row>
            <NameInput placeholder={library?.path} />
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
        </Container>
        <Button
          content={intl.formatMessage({ id: 'cancel' })}
          onClick={() => {
            setShow(false);
            setSelectedLibrary(null);
          }}
        />
        <Button content={intl.formatMessage({ id: 'save' })} disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
      </Card.Body>
    </Card>
  );
};

LibraryAdd.defaultProps = {
  setShow: null,
  setSelectedLibrary: null,
  library: null,
};

LibraryAdd.propTypes = propTypes;

export default injectIntl(LibraryAdd);
