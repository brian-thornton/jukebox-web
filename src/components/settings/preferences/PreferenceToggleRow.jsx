import React, { useContext } from 'react';

import Button from '../../Button';
import Item from '../../common/Item';
import { SettingsContext } from '../../layout/SettingsProvider';
import { updateSettings } from '../../../lib/settings-client';

const PreferenceToggleRow = ({ name, value }) => {
  const settings = useContext(SettingsContext);

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  const updatePreference = async (preferenceName, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[preferenceName] = value;
    await updateSettings(deepClone);
    window.location.reload();
  };

  const buttonText = value ? 'Enabled' : 'Disabled';

  return (
    <Item
      style={{ width: '100%' }}
      buttons={(
        <Button
          onClick={() => updatePreference(name, !value)}
          isToggle
          isToggled={value}
          content={buttonText}
        />
      )}
      text={rowLabel(name)}
    />
  );
};

export default PreferenceToggleRow;
