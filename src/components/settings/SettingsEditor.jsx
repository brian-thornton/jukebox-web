import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';

import Button from '../Button';
import Item from '../common/Item';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';

function SettingsEditor() {
  const settings = useContext(SettingsContext);

  const updateFeature = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';

    return (
      <Item
        buttons={(
          <Button
            onClick={() => updateFeature(name, !value)}
            isToggle
            isToggled={value}
            content={buttonText}
          />
        )}
        text={name}
      />
    );
  };

  const content = () => {
    const { features } = settings;
    return Object.keys(features).map(key => settingRow(key, features[key]));
  };

  return <ListGroup>{content()}</ListGroup>;
}
export default SettingsEditor;
