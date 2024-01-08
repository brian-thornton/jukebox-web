import Form from 'react-bootstrap/Form';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ILibrary } from '../../../interface';
import styles from './DownloadCoverArtPreference.module.css';

interface IDownloadCoverArtPreference {
  onSelect: Function,
  library?: ILibrary,
}

const DownloadCoverArtPreference: FC<IDownloadCoverArtPreference> = ({ library, onSelect }) => (
  <div className={styles.rowContainer} >
    <Form>
      <Form.Check
        inline
        label={<FormattedMessage id="do_not_download_cover_art" />}
        name="group1"
        type="radio"
        id="no"
        checked={!library?.allowCoverArtDownload}
        onChange={() => onSelect(false)}
      />
      <Form.Check
        inline
        label={<FormattedMessage id="download_cover_art" />}
        name="group1"
        type="radio"
        id="yes"
        checked={library?.allowCoverArtDownload}
        onChange={() => onSelect(true)}
      />
    </Form>
  </div>
);

export default DownloadCoverArtPreference;
