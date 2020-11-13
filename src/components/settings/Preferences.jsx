import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, InputGroup, FormControl,
} from 'react-bootstrap';
import styles from '../styles';
import SettingsClient from '../../lib/settings-client';

function Preferences() {
  const [settings, setSettings] = useState();
  const [name, setName] = useState('');

  if (!settings) {
    SettingsClient.getSettings().then((data) => {
      setSettings(data);
      setName(data.preferences.name);
    });
  }

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  const updateFeature = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    SettingsClient.updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const handleSave = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences['name'] = name;
    SettingsClient.updateSettings(deepClone).then(() => {
      window.location.reload();
    });
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
                onChange={(event) => setName(event.target.value)}
              />
            </InputGroup>
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );
  };

  return preferences();
}
export default Preferences;
