import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import styles from './styles';
import LibraryList from './LibraryList';
import SettingsEditor from './SettingsEditor';
import SpotifySettings from './SpotifySettings';
import ContentWithControls from './ContentWithControls';
import PinModal from './PinModal';
import Preferences from './Preferences';

function Settings({ settings }) {
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);

  if (!isAuthorized && !isPinOpen && !modalClosed) {
    setIsPinOpen(true);
  }

  const content = () => {
    if (isAuthorized) {
      if (mode === 'LIBRARY') {
        return <LibraryList />;
      } if (mode === 'SETTINGS') {
        return <SettingsEditor />;
      } if (mode === 'SPOTIFY') {
        return <SpotifySettings />;
      } if (mode === 'PREFERENCES') {
        return <Preferences />;
      }
    }

    return <React.Fragment />;
  };

  const buttonProps = {
    style: styles.settingsButtonStyle,
    variant: 'outline-light',
  };

  const handleClose = (isAuthorized) => {
    setIsPinOpen(false);
    setIsAuthorized(isAuthorized);
    setModalClosed(true);
  };

  const controls = () => {
    if (isAuthorized) {
      return (
        <React.Fragment>
          <Button {...buttonProps} onClick={() => setMode('LIBRARY')}>Library</Button>
          <Button {...buttonProps} onClick={() => setMode('SETTINGS')}>Features</Button>
          <Button {...buttonProps} onClick={() => setMode('PREFERENCES')}>Preferences</Button>
          <Button {...buttonProps} onClick={() => setMode('SPOTIFY')}>Spotify</Button>
        </React.Fragment>
      );
    }

    return <React.Fragment />;
  };

  if (isAuthorized) {
    const alertText = 'Configure settings below to control your jukebox.';
    return <ContentWithControls controls={controls()} content={content()} alertText={alertText} />;
  }

  const notAuthorizedText = 'Please enter pin number to access settings.';
  return (
    <React.Fragment>
      <Alert variant="primary">{notAuthorizedText}</Alert>
      <PinModal isOpen={isPinOpen} settings={settings} handleClose={handleClose} />
    </React.Fragment>
  );
}

export default Settings;
