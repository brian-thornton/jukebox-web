import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import CategoryPicker from './CategoryPicker';
import NameInput from '../../common/NameInput';
import { SettingsContext } from '../../layout/SettingsProvider';
import './LibraryAdd.scss';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const DownloadCoverArtPicker = ({
  onSelect,
}) => {
  return (
    <Container fluid>
      <Row>
        <Form>
          <div className="mb-3">
            <Form.Check
              inline
              label="Do NOT automatically download cover art"
              name="group1"
              type="radio"
              id="no"
              onChange={() => onSelect(false)}
            />
            <Form.Check
              inline
              label="Automatically download cover art"
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
}

DownloadCoverArtPicker.propTypes = propTypes;

export default DownloadCoverArtPicker;
