import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../Button';
import CategoryPicker from './CategoryPicker';
import DownloadCoverArtPreference from './DownloadCoverArtPreference';
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
  setShow,
  setSelectedLibrary,
  handleSave,
  library,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(library.category);
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
      <Card.Title><FormattedMessage id={library ? 'edit_library' : 'add_library'} /></Card.Title>
      <Card.Body style={{ background: settings.styles.trackBackgroundColor }}>
        <Container fluid className="addContainer">
          <Row>
            <NameInput placeholder={library?.path || intl.formatMessage({ id: 'path' })} />
          </Row>
          <Row>
            <CategoryPicker
              onSelectCategory={category => setSelectedCategory(category)}
              category={selectedCategory}
            />
          </Row>
          <Row>
            <DownloadCoverArtPreference library={library} onSelect={onSelectDownloadPreference} />
          </Row>
        </Container>
        <Button
          content={<FormattedMessage id="cancel" />}
          onClick={() => {
            setShow(false);
            setSelectedLibrary(null);
          }}
        />
        <Button content={<FormattedMessage id="save" />} disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
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

export default LibraryAdd;
