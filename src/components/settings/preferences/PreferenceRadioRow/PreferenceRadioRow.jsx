import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';

import { SettingsContext } from '../../../layout/SettingsProvider';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';
import { Options } from '../../../shapes';
import classes from './PreferenceRadioRow.module.css';

const propTypes = {
  rowName: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
  options: Options.isRequired,
};

const PreferenceRadioRow = ({ rowName, preferenceName, options }) => {
  const settings = useContext(SettingsContext);
  const { styles, preferences } = settings || {};
  const [radioValue, setRadioValue] = useState(options[0]?.value || '');

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const itemStyle = {
    color: styles.fontColor,
    background: styles.trackBackgroundColor,
    fontFamily: styles.listFont,
  };

  return (
    <div className={classes.radioRowContainer} style={itemStyle}>
      {rowLabel(rowName)}
      <Form>
        <div key={radioValue}>
          {options.map(option => (
            <Form.Check
              inline
              label={option.display}
              name="group1"
              type="radio"
              checked={preferences[preferenceName] === option.value}
              onChange={() => {
                setRadioValue(option.value);
                updatePreference(settings, preferenceName, option.value, '/settings?mode=preferences');
              }}
            />
          ))}
        </div>
      </Form>
    </div>
  );
};

PreferenceRadioRow.propTypes = propTypes;

export default PreferenceRadioRow;
