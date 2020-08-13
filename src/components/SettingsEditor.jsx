import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import styles from './styles';
import SettingsClient from '../lib/settings-client';

function SettingsEditor() {
  const [settings, setSettings] = useState();

  if (!settings) {
    SettingsClient.getSettings().then(data => setSettings(data));
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

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';
    const style = value ? styles.enabledStyle : styles.disabledStyle;

    return (
      <ListGroupItem style={styles.cardStyle}>
        {name}
        <Button
          {...buttonProps}
          onClick={() => updateFeature(name, !value)}
          enabled={value}
          style={style}
        >
          {buttonText}
        </Button>
      </ListGroupItem>
    );
  };

  const features = () => {
    if (!settings) {
      return (<React.Fragment />);
    }

    return (
      <ListGroup>
        {settingRow('albums', settings.features.albums)}
        {settingRow('tracks', settings.features.tracks)}
        {settingRow('playlists', settings.features.playlists)}
        {settingRow('queue', settings.features.queue)}
        {settingRow('settings', settings.features.settings)}
        {settingRow('volume', settings.features.volume)}
        {settingRow('next', settings.features.next)}
        {settingRow('stop', settings.features.stop)}
        {settingRow('play', settings.features.play)}
        {settingRow('playNow', settings.features.playNow)}
        {settingRow('enqueue', settings.features.enqueue)}
        {settingRow('playAlbum', settings.features.playAlbum)}
        {settingRow('addToPlaylist', settings.features.addToPlaylist)}
        {settingRow('deletePlaylist', settings.features.deletePlaylist)}
      </ListGroup>
    );
  };

  return features();
}
export default SettingsEditor;
