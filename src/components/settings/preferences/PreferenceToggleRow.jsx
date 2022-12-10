import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import Button from '../../Button';
import Item from '../../common/Item';
import { SettingsContext } from '../../layout/SettingsProvider';
import './PreferenceToggleRow.scss';
import { updatePreference } from '../../../lib/preferenceHelper';

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const PreferenceToggleRow = ({ name, value }) => {
  const settings = useContext(SettingsContext);

  const rowLabel = (labelText) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const buttonText = value ? 'Enabled' : 'Disabled';

  return (
    <Item
      className="preference-toggle-row"
      buttons={(
        <Button
          onClick={() => {
            updatePreference(settings, name, !value, '/settings?mode=preferences');
          }}
          isToggle
          isToggled={value}
          content={buttonText}
        />
      )}
      text={rowLabel(name)}
    />
  );
};

PreferenceToggleRow.propTypes = propTypes;

export default PreferenceToggleRow;
