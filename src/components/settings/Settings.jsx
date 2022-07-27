import React, { useContext, useState } from 'react';

import CabinetConfiguration from './CabinetConfiguration';
import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import LibraryList from './LibraryList';
import Preferences from './Preferences';
import SettingsEditor from './SettingsEditor';
import { SettingsContext } from '../layout/SettingsProvider';
import ThemeList from './ThemeList';
import PinEntry from '../common/PinEntry';

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
          <ControlButton onClick={() => setMode('CABINET')} text="Cabinet Config" />
        </>
      );
    }

    return <></>;
  };

  const content = () => {
    if (isAuthorized || !settings.preferences.pinEnabled) {
      if (mode === 'LIBRARY') {
        return <LibraryList />;
      } 
      
      if (mode === 'SETTINGS') {
        return <SettingsEditor />;
      } 
      
      if (mode === 'PREFERENCES') {
        return <Preferences />;
      }

      if (mode === 'CABINET') {
        return <CabinetConfiguration />;
      }
      
      if (mode === 'STYLE') {
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

  if ((isAuthorized || !settings.preferences.pinEnabled) && !controls) {
    setControls(leftControls());
  }

  if (isAuthorized || !settings.preferences.pinEnabled) {
    return <ContentWithControls controls={controls} content={content()} />;
  }

  return (!isAuthorized && (
    <div style={{ marginTop: '60px' }}>
      <PinEntry
        onAuthorize={() => {
          setIsAuthorized(true);
          setIsPinOpen(false);
        }}
        onCancel={() => {
          setIsAuthorized(false);
          setIsPinOpen(false);
        }}
      />
    </div>
  ));
}

export default Settings;
