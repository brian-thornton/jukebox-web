import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { PropTypes } from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

import './LibraryAdd.scss';

const propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const DownloadCoverArtPicker = ({ intl, onSelect }) => (
  <Container fluid>
    <Row>
      <Form>
        <div className="mb-3">
          <Form.Check
            inline
            label={intl.formatMessage({ id: 'do_not_download_cover_art' })}
            name="group1"
            type="radio"
            id="no"
            onChange={() => onSelect(false)}
          />
          <Form.Check
            inline
            label={intl.formatMessage({ id: 'download_cover_art' })}
            name="group1"
            type="radio"
            id="yes"
            onChange={() => onSelect(true)}
          />
        </div>
      </Form>
    </Row>
  </Container>
);

DownloadCoverArtPicker.propTypes = propTypes;

export default injectIntl(DownloadCoverArtPicker);
