import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CabinetConfiguration from './CabinetConfiguration';
import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import Libraries from './libraries/Libraries';
import Preferences from './preferences/Preferences';
import SettingsEditor from './SettingsEditor';
import { SettingsContext } from '../layout/SettingsProvider';
import Skins from './Skins';
import PinEntry from '../common/PinEntry';
import { applyLighting } from '../../lib/lightingHelper';

const Settings = () => {
  const settings = useContext(SettingsContext);
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [controls, setControls] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('mode')) {
      setMode(searchParams.get('mode').toUpperCase());
    }

    applyLighting(settings, 'Settings');
  }, []);

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
      return (
        <>
          {mode === 'LIBRARY' && <Libraries />}
          {mode === 'SETTINGS' && <SettingsEditor />}
          {mode === 'PREFERENCES' && <Preferences />}
          {mode === 'CABINET' && <CabinetConfiguration />}
          {mode === 'STYLE' && (
            <Skins
              resetControls={() => setControls(leftControls())}
              setControls={setControls}
            />
          )}
        </>
      );
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
