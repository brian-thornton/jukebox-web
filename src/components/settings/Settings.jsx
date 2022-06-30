import React, { useContext, useState } from 'react';

import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import LibraryList from './LibraryList';
import PinModal from './PinModal';
import Preferences from './Preferences';
import SettingsEditor from './SettingsEditor';
import { SettingsContext } from '../layout/SettingsProvider';
import ThemeList from './ThemeList';

const Settings = () => {
  const settings = useContext(SettingsContext);
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [controls, setControls] = useState(null);

  if (settings) {
    if (settings.preferences.pinEnabled && !isAuthorized && !isPinOpen && !modalClosed) {
      setIsPinOpen(true);
    }
  }

  const leftControls = () => {
    if ((settings.preferences.pinEnabled && isAuthorized) || !settings.preferences.pinEnabled) {
      return (
        <>
          <ControlButton onClick={() => setMode('LIBRARY')} text="Library" />
          <ControlButton onClick={() => setMode('SETTINGS')} text="Features" />
          <ControlButton onClick={() => setMode('PREFERENCES')} text="Preferences" />
          <ControlButton onClick={() => setMode('STYLE')} text="Style" />
        </>
      );
    }

    return <></>;
  };

  const content = () => {
    if (isAuthorized || !settings.preferences.pinEnabled) {
      if (mode === 'LIBRARY') {
        return <LibraryList />;
      } if (mode === 'SETTINGS') {
        return <SettingsEditor />;
      } if (mode === 'PREFERENCES') {
        return <Preferences />;
      } if (mode === 'STYLE') {
        return (
          <ThemeList
            resetControls={() => setControls(leftControls())}
            setControls={setControls}
          />
        );
      }
    }

    return <></>;
  };

  const handleClose = (authorized) => {
    setIsPinOpen(false);
    setIsAuthorized(authorized);
    setModalClosed(true);
  };

  if ((isAuthorized || !settings.preferences.pinEnabled) && !controls) {
    setControls(leftControls());
  }

  if (isAuthorized || !settings.preferences.pinEnabled) {
    return <ContentWithControls controls={controls} content={content()} />;
  }

  return <PinModal isOpen={isPinOpen} handleClose={handleClose} />;
}

export default Settings;
