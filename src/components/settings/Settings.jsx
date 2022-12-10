import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CabinetConfiguration from './CabinetConfiguration';
import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import Libraries from './libraries/Libraries';
import Preferences from './preferences/Preferences';
import SettingsEditor from './SettingsEditor';
import { SettingsContext } from '../layout/SettingsProvider';
import RestrictionModes from './content/RestrictionModes';
import Skins from './skins/Skins';
import PinEntry from '../common/PinEntry';
import { applyLighting } from '../../lib/lightingHelper';
import './Settings.scss';

const Settings = () => {
  const settings = useContext(SettingsContext);
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [controls, setControls] = useState(null);
  const [searchParams] = useSearchParams();
  const { controlButtonSize } = settings.styles;
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';


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
          <ControlButton isSelected={mode === 'LIBRARY'} width="100%" onClick={() => setMode('LIBRARY')} text="Library" height={buttonHeight} style={{ fontSize }} />
          <ControlButton isSelected={mode === 'SETTINGS'} width="100%" onClick={() => setMode('SETTINGS')} text="Features" height={buttonHeight} style={{ fontSize }} />
          <ControlButton isSelected={mode === 'PREFERENCES'} width="100%" onClick={() => setMode('PREFERENCES')} text="Preferences" height={buttonHeight} style={{ fontSize }} />
          <ControlButton isSelected={mode === 'STYLE'} width="100%" onClick={() => setMode('STYLE')} text="Style" height={buttonHeight} style={{ fontSize }} />
          <ControlButton isSelected={mode === 'RESTRICTIONS'} width="100%" onClick={() => setMode('RESTRICTIONS')} text="Restrictions" height={buttonHeight} style={{ fontSize }} />
          <ControlButton isSelected={mode === 'CABINET'} width="100%" onClick={() => setMode('CABINET')} text="Cabinet" height={buttonHeight} style={{ fontSize }} />
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
          {mode === 'RESTRICTIONS' && <RestrictionModes />}
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
    return <ContentWithControls controls={leftControls()} content={content()} />;
  }

  return (!isAuthorized && (
    <div className="settings-pin-container">
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
};

export default Settings;
