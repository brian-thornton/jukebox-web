import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Row, Container, 
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
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

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';
    const style = value ? styles.enabledStyle : styles.disabledStyle;

    return (
      <ListGroupItem style={styles.cardStyle}>
        <Container>
          <Row>
            <Col style={styles.textStyle}>{name}</Col>
            <Col>
              <Button
                {...buttonProps}
                enabled={value}
                style={style}
              >
                {buttonText}
              </Button>
            </Col>
          </Row>
        </Container>
      </ListGroupItem >
    );
  };

  const updateFeature = (feature, value) => {

  };

  const features = () => {
    if (!settings) {
      return (<React.Fragment />);
    }

    return (
      <ListGroup>
        {settingRow('albums', settings.features.albums)};
        {settingRow('tracks', settings.features.tracks)};
        {settingRow('playlists', settings.features.playlists)};
        {settingRow('queue', settings.features.queue)};
        {settingRow('settings', settings.features.settings)};
        {settingRow('volume', settings.features.volume)};
        {settingRow('next', settings.features.next)};
        {settingRow('stop', settings.features.stop)};
        {settingRow('play', settings.features.play)};
        {settingRow('playNow', settings.features.playNow)};
        {settingRow('enqueue', settings.features.enqueue)};
        {settingRow('playAlbum', settings.features.playAlbum)};
        {settingRow('addToPlaylist', settings.features.addToPlaylist)};
        {settingRow('deletePlaylist', settings.features.deletePlaylist)};
      </ListGroup>
    );
  };

  return features();
}
export default SettingsEditor;
