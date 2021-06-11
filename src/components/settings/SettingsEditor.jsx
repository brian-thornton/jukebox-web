import React, { useContext } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import styles from '../styles';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/Jukebox';
import { buttonProps } from '../../lib/styleHelper';

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
    const style = value ? styles.enabledStyle : styles.disabledStyle;

    return (
      <ListGroupItem style={styles.cardStyle}>
        {name}
        <Button
          {...buttonProps(settings)}
          onClick={() => updateFeature(name, !value)}
          enabled={value}
          style={style}
        >
          {buttonText}
        </Button>
      </ListGroupItem>
    );
  };

  const content = () => {
    const rows = [];

    Object.keys(settings.features).forEach(key => {
      rows.push(settingRow(key, settings.features[key]));
    });

    return rows;
  };

  return (
    <ListGroup>
      {content()}
    </ListGroup>
  );
}
export default SettingsEditor;
