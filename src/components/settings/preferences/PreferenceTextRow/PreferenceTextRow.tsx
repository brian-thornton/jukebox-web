import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { FC, useCallback, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { debounce } from 'lodash';

import { SettingsContext } from '../../../layout/SettingsProvider';
import NameInput from '../../../common/NameInput/NameInput';
import classes from './PreferenceTextRow.module.css';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';

interface IPreferenceTextRow {
  rowName: string,
  value?: string,
}

const PreferenceTextRow: FC<IPreferenceTextRow> = ({ rowName, value }) => {
  const settings = useContext(SettingsContext);
  const styles = settings?.styles;
  const { screen } = settings || {};

  const rowLabel = (labelText: string) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const itemStyle = {
    color: styles?.fontColor,
    background: styles?.trackBackgroundColor,
    fontFamily: styles?.listFont,
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
      <Container fluid className={classes.preferenceTextRowContainer} style={{paddingLeft: 0, marginLeft: 0}}>
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


export default PreferenceTextRow;
