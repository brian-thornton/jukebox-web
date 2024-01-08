import Card from 'react-bootstrap/Card';
import { FC, useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../common/Button/Button';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import DownloadCoverArtPicker from '../DownloadCoverArtPreference/DownloadCoverArtPreference';
import NameInput from '../../../common/NameInput/NameInput';
import { SettingsContext } from '../../../layout/SettingsProvider';
import styles from './Discover.module.css'

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
    <Card className={styles.discoverCard} style={confirmStyle}>
      <Card.Title><FormattedMessage id="discover" /></Card.Title>
      <Card.Body style={{ background: settings?.styles?.trackBackgroundColor }}>
        <div className={styles.discoverContent}>
          <NameInput name="Path" placeholder={intl.formatMessage({ id: 'path' })} />
          <CategoryPicker
            onSelectCategory={(category: any) => setSelectedCategory(category)}
            category={selectedCategory}
          />
          <DownloadCoverArtPicker onSelect={onSelectDownloadPreference} />
          <div className={styles.discoverRow}>
            <Button content={<FormattedMessage id="cancel" />} onClick={handleHide} />
            <Button
              content={<FormattedMessage id="save" />}
              disabled={!downloadCoverArtDirty}
              onClick={() => handleSave(selectedCategory, allowCoverArtDownload)}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Discover;
