import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { FC } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import { ILibrary } from '../../../interface';

interface IDownloadCoverArtPreference {
  onSelect: Function,
  library?: ILibrary,
}

const DownloadCoverArtPreference: FC<IDownloadCoverArtPreference> = ({ library, onSelect }) => (
  <Container fluid>
    <Row>
      <Form>
        <div className="mb-3">
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
        </div>
      </Form>
    </Row>
  </Container>
);

export default DownloadCoverArtPreference;
