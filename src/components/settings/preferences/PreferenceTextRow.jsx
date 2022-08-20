import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../../layout/SettingsProvider';
import { updateSettings } from '../../../lib/settings-client';
import NameInput from '../../common/NameInput';
import './PreferenceTextRow.scss';

const PreferenceTextRow = ({rowName, value}) => {
  const settings = useContext(SettingsContext);

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  const updatePreference = (preferenceName, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[preferenceName] = value;
    updateSettings(deepClone);
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
            <NameInput
              defaultValue={value}
              onChange={event => updatePreference(rowName, event.target.value)}
            />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
};

export default PreferenceTextRow;
