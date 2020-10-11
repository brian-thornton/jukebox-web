import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './styles';
import LibraryList from './LibraryList';
import SettingsEditor from './SettingsEditor';
import SpotifySettings from './SpotifySettings';
import ContentWithControls from './ContentWithControls';
import PinModal from './PinModal';

function Settings() {
  const [mode, setMode] = useState('LIBRARY');

  const content = () => {
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

  const controls = () => (
    <React.Fragment>
      <Button {...buttonProps} onClick={() => setMode('LIBRARY')}>Library</Button>
      <Button {...buttonProps} onClick={() => setMode('SETTINGS')}>Features</Button>
      <Button {...buttonProps} onClick={() => setMode('SPOTIFY')}>Spotify</Button>
    </React.Fragment>
  );

  const alertText = 'Configure settings below to control your jukebox.';
  return (
    <React.Fragment>
      <ContentWithControls controls={controls()} content={content()} alertText={alertText} />
      <PinModal isOpen />
    </React.Fragment>
  );
}

export default Settings;
