import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../Button';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import DownloadCoverArtPicker from '../DownloadCoverArtPreference/DownloadCoverArtPreference';
import NameInput from '../../../common/NameInput/NameInput';
import { SettingsContext } from '../../../layout/SettingsProvider';

interface IDiscover {
  handleHide: Function,
  handleSave: Function,
}

const Discover: FC<IDiscover> = ({
  handleHide,
  handleSave,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState();
  const [downloadCoverArtDirty, setDownloadCoverArtDirty] = useState(false);
  const { isScreenSmall } = settings;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  const onSelectDownloadPreference = (value: any) => {
    setAllowCoverArtDownload(value);
    setDownloadCoverArtDirty(true);
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Title><FormattedMessage id="discover" /></Card.Title>
      <Card.Body style={{ background: settings?.styles?.trackBackgroundColor }}>
        <Container fluid>
          <Row>
            <NameInput name="Path" placeholder={intl.formatMessage({ id: 'path' })} />
          </Row>
          <Row>
            <CategoryPicker
              onSelectCategory={(category: any) => setSelectedCategory(category)}
              category={selectedCategory}
            />
          </Row>
          <Row>
            <DownloadCoverArtPicker onSelect={onSelectDownloadPreference} />
          </Row>
          <Row>
            <Button content={<FormattedMessage id="cancel" />} onClick={handleHide} />
            <Button content={<FormattedMessage id="save" />} disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Discover;
