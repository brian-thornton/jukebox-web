import React, { useContext } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';

import Item from '../common/Item';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/Jukebox';
import { buttonProps, card, disabledButton, enabledButton } from '../../lib/styleHelper';

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
    const style = value ? enabledButton(settings) : disabledButton(settings);

    return (
      <Item
        buttons={
          <Button
            {...buttonProps(settings)}
            onClick={() => updateFeature(name, !value)}
            enabled={value}
            style={style}
          >
            {buttonText}
          </Button>
        }
        text={name}
      />
    )
  };

  const content = () => {
    const { features } = settings;
    return Object.keys(features).map((key) => settingRow(key, features[key]));
  };

  return <ListGroup>{content()}</ListGroup>;
}
export default SettingsEditor;
