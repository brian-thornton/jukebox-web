import { PropTypes } from 'prop-types';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import { getBase64 } from '../../../lib/localStorageHelper';

const propTypes = {
  name: PropTypes.string.isRequired,
};

const PreferenceFileRow = ({ intl, name }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const imageUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then((base64) => {
      localStorage[name] = base64;
      navigate('/albums');
    });
  };

  return (
    <ListGroupItem
      style={{
        color: settings.styles.fontColor,
        background: settings.styles.trackBackgroundColor,
        fontFamily: settings.styles.listFont,
        height: '60px',
      }}
    >
      <Container fluid style={{ marginBottom: '0px' }}>
        <Row>
          <Col lg="2">
            {rowLabel(name)}
          </Col>
          <Col lg="8">
            <Form.Group className="mb-3" controlId="title" style={{ marginBottom: '0px' }}>
              <Form.Control style={{ marginBottom: '0px' }} type="file" onChange={imageUpload} />
            </Form.Group>
          </Col>
          <Col lg="2">
            <Button
              onClick={() => {
                localStorage.removeItem(name);
                navigate('/albums');
              }}
              content={intl.formatMessage({ id: 'clear' })}
            />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
};

PreferenceFileRow.propTypes = propTypes;

export default injectIntl(PreferenceFileRow);
