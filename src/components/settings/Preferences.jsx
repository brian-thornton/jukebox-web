import React, { useState, useContext } from 'react';
import {
  ListGroup, ListGroupItem, Button, InputGroup, FormControl,
} from 'react-bootstrap';
import Item from '../common/Item';
import styles from '../styles';
import { SettingsContext } from '../layout/Jukebox';
import { updateSettings } from '../../lib/settings-client';
import { buttonProps, disabledButton, enabledButton } from '../../lib/styleHelper';


function Preferences() {
  const settings = useContext(SettingsContext);
  const [name, setName] = useState(settings.preferences.name);

  const handleSave = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences.name = name;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const updatePreference = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[name] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const preferencesRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';
    const style = value ? enabledButton(settings) : disabledButton(settings);

    return (
      <Item
        buttons={(
          <Button
            {...buttonProps(settings)}
            onClick={() => updatePreference(name, !value)}
            enabled={value}
            style={style}
          >
            {buttonText}
          </Button>
        )}
        text={name}
      />
    )
  };

  const preferences = () => {
    return (
      <>
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
      </>
    );
  };

  return preferences();
}
export default Preferences;
