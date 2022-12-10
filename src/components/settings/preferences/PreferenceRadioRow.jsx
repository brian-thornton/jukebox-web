import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { PropTypes } from 'prop-types';

import { SettingsContext } from '../../layout/SettingsProvider';
import './PreferenceTextRow.scss';
import { updatePreference } from '../../../lib/preferenceHelper';
import { Options } from '../../shapes';

const propTypes = {
  rowName: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
  options: Options.isRequired,
};

const PreferenceRadioRow = ({ rowName, preferenceName, options }) => {
  const settings = useContext(SettingsContext);
  const [radioValue, setRadioValue] = useState(options[0]?.value || '');

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
    width: '100%',
    height: '60px',
  };

  return (
    <ListGroupItem style={itemStyle}>
      <Container fluid className="preference-text-row-container">
        <Row>
          <Col lg="2">
            {rowLabel(rowName)}
          </Col>
          <Col lg="8">
            <Form>
              <div key={radioValue} className="mb-3">
                {options.map(option => (
                  <Form.Check
                    inline
                    label={option.display}
                    name="group1"
                    type="radio"
                    checked={settings.preferences[preferenceName] === option.value}
                    onChange={() => {
                      setRadioValue(option.value);
                      updatePreference(settings, preferenceName, option.value, '/settings?mode=preferences');
                    }}
                  />
                ))}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
};

PreferenceRadioRow.propTypes = propTypes;

export default PreferenceRadioRow;
