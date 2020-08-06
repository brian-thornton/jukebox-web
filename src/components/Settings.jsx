import React, { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import styles from './styles';
import LibraryList from './LibraryList';
import SettingsEditor from './SettingsEditor';
import SpotifySettings from './SpotifySettings';

function Settings() {
  const [mode, setMode] = useState('LIBRARY');

  const controls = () => {
    if (mode === 'LIBRARY') {
      return <LibraryList />;
    } if (mode === 'SETTINGS') {
      return <SettingsEditor />;
    } if (mode === 'SPOTIFY') {
      return <SpotifySettings />;
    }
  };

  const buttonProps = {
    style: styles.settingsButtonStyle,
    variant: 'outline-light',
  };

  return (
    <Container>
      <Row>
        <Col lg={12} xl={12} >
          <Alert variant="primary">Configure settings below to control your jukebox.</Alert>
        </Col>
      </Row>
      <Row>
        <Col lg={2} xl={2}>
          <Button {...buttonProps} onClick={() => setMode('LIBRARY')}>Library</Button>
          <Button {...buttonProps} onClick={() => setMode('SETTINGS')}>Features</Button>
          <Button {...buttonProps} onClick={() => setMode('SPOTIFY')}>Spotify</Button>
        </Col>
        <Col lg={10} xl={10}>
          {controls()}
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
