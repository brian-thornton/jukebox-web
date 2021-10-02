import React, { useState, useContext } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import Button from '../Button';
import Item from '../common/Item';
import styles from '../styles';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import NameInput from '../common/NameInput';

const Preferences = () => {
  const settings = useContext(SettingsContext);
  const [name, setName] = useState(settings.preferences.name);

  const handleSave = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences.name = name;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const updatePreference = (preferenceName, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[preferenceName] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const preferencesRow = (rowName, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';

    return (
      <Item
        buttons={(
          <Button
            onClick={() => updatePreference(rowName, !value)}
            isToggle={true}
            isToggled={value}
            content={buttonText}
          />
        )}
        text={rowName}
      />
    );
  };

  return (
    <>
      <Button onClick={handleSave} content="Save" />
      <ListGroup>
        <ListGroupItem style={styles.cardStyle}>
          Jukebox Name:
          <NameInput defaultValue={settings.preferences.name} onChange={event => setName(event.target.value)} />
        </ListGroupItem>
        {preferencesRow('showAlbumName', settings.preferences.showAlbumName)}
        {preferencesRow('showAlbumsWithoutCoverArt', settings.preferences.showAlbumsWithoutCoverArt)}
      </ListGroup>
    </>
  );
}
export default Preferences;
