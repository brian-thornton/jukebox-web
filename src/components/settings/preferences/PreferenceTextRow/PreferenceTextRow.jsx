import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useCallback, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { debounce } from 'lodash';
import { PropTypes } from 'prop-types';

import { SettingsContext } from '../../../layout/SettingsProvider';
import NameInput from '../../../common/NameInput/NameInput';
import './PreferenceTextRow.scss';
import { updatePreference } from '../../../../lib/preferenceHelper';

const propTypes = {
  rowName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const PreferenceTextRow = ({ rowName, value }) => {
  const settings = useContext(SettingsContext);
  const { screen } = settings || {};

  const rowLabel = (labelText) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
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

  const debouncedUpdate = useCallback(
    debounce((event) => {
      updatePreference(settings, rowName, event.target.value, '/settings?mode=preferences');
    }, 1000), [],
  );

  return (
    <ListGroupItem style={itemStyle}>
      <Container fluid className="preference-text-row-container" style={{paddingLeft: 0, marginLeft: 0}}>
        <Row>
          <Col lg="12">
            <NameInput
              name={rowLabel(rowName)}
              defaultValue={value}
              onChange={debouncedUpdate}
            />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
};

PreferenceTextRow.propTypes = propTypes;

export default PreferenceTextRow;
