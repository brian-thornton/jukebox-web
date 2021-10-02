import React, { useState } from 'react';
import LibraryList from './LibraryList';
import SettingsEditor from './SettingsEditor';
import ThemeList from './ThemeList';
import ContentWithControls from '../common/ContentWithControls';
import PinModal from './PinModal';
import Preferences from './Preferences';

import ControlButton from '../common/ControlButton';

function Settings() {
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
          <ControlButton onClick={() => setMode('LIBRARY')} text="Library" />
          <ControlButton onClick={() => setMode('SETTINGS')} text="Features" />
          <ControlButton onClick={() => setMode('PREFERENCES')} text="Preferences" />
          <ControlButton onClick={() => setMode('STYLE')} text="Style" />
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
    if (!hideControls) {
      return <ContentWithControls controls={controls} content={content()} />;
    }

    return content();
  }

  return <PinModal isOpen={isPinOpen} handleClose={handleClose} />;
}

export default Settings;
