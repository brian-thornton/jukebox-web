import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { PropTypes } from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import './LibraryAdd.scss';

const propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const DownloadCoverArtPreference = ({ library, onSelect }) => (
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

DownloadCoverArtPreference.propTypes = propTypes;

export default DownloadCoverArtPreference;
