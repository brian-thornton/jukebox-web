import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, InputGroup, FormControl,
} from 'react-bootstrap';
import styles from '../styles';
import SettingsClient from '../../lib/settings-client';

function Preferences() {
  const [settings, setSettings] = useState();
  const [name, setName] = useState('');

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  if (!settings) {
    SettingsClient.getSettings().then((data) => {
      setSettings(data);
      setName(data.preferences.name);
    });
  }

  const handleSave = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences.name = name;
    SettingsClient.updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const updatePreference = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[name] = value;
    SettingsClient.updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const preferencesRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';
    const style = value ? styles.enabledStyle : styles.disabledStyle;

    return (
      <ListGroupItem style={styles.cardStyle}>
        {name}
        <Button
          {...buttonProps}
          onClick={() => updatePreference(name, !value)}
          enabled={value}
          style={style}
        >
          {buttonText}
        </Button>
      </ListGroupItem>
    );
  };

  const preferences = () => {
    if (!settings) {
      return (<React.Fragment />);
    }

    return (
      <React.Fragment>
        <Button onClick={handleSave}>Save</Button>
        <ListGroup>
          <ListGroupItem style={styles.cardStyle}>
            Jukebox Name:
            <InputGroup className="mb-3">
              <FormControl
                id="name"
                placeholder={settings.preferences.name}
                aria-label="name"
                aria-describedby="basic-addon1"
                onChange={event => setName(event.target.value)}
              />
            </InputGroup>
          </ListGroupItem>
          {preferencesRow('showAlbumName', settings.preferences.showAlbumName)}
          {preferencesRow('showAlbumsWithoutCoverArt', settings.preferences.showAlbumsWithoutCoverArt)}
        </ListGroup>
      </React.Fragment>
    );
  };

  return preferences();
}
export default Preferences;
