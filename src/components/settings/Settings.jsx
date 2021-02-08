import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import LibraryList from './LibraryList';
import SettingsEditor from './SettingsEditor';
import SpotifySettings from './SpotifySettings';
import ThemeList from './ThemeList';
import ContentWithControls from '../ContentWithControls';
import PinModal from './PinModal';
import Preferences from './Preferences';
import { Settings as SettingsShape } from '../shapes';
import { controlButtonProps } from '../../lib/styleHelper';

const propTypes = {
  settings: SettingsShape.isRequired,
};

function Settings({ settings }) {
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [controls, setControls] = useState(null);

  if (!isAuthorized && !isPinOpen && !modalClosed) {
    setIsPinOpen(true);
  }

  const leftControls = () => {
    if (isAuthorized) {
      return (
        <React.Fragment>
          <Button {...controlButtonProps(settings)} onClick={() => setMode('LIBRARY')}>Library</Button>
          <Button {...controlButtonProps(settings)} onClick={() => setMode('SETTINGS')}>Features</Button>
          <Button {...controlButtonProps(settings)} onClick={() => setMode('PREFERENCES')}>Preferences</Button>
          <Button {...controlButtonProps(settings)} onClick={() => setMode('STYLE')}>Style</Button>
          <Button {...controlButtonProps(settings)} onClick={() => setMode('SPOTIFY')}>Spotify</Button>
        </React.Fragment>
      );
    }

    return <React.Fragment />;
  };

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
      } if (mode === 'STYLE') {
        return (
          <ThemeList
            settings={settings}
            resetControls={() => setControls(leftControls())}
            setControls={setControls}
          />
        );
      }
    }

    return <React.Fragment />;
  };

  const handleClose = (authorized) => {
    setIsPinOpen(false);
    setIsAuthorized(authorized);
    setModalClosed(true);
  };

  if (isAuthorized && !controls) {
    setControls(leftControls());
  }

  if (isAuthorized) {
    const alertText = 'Configure settings below to control your jukebox.';
    if (!hideControls) {
      return <ContentWithControls controls={controls} content={content()} alertText={alertText} />;
    }

    return content();
  }

  const notAuthorizedText = 'Please enter pin number to access settings.';
  return (
    <React.Fragment>
      <Alert variant="primary">{notAuthorizedText}</Alert>
      <PinModal isOpen={isPinOpen} settings={settings} handleClose={handleClose} />
    </React.Fragment>
  );
}

Settings.propTypes = propTypes;

export default Settings;
