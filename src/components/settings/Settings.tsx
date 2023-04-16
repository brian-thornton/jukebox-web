import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CabinetConfiguration from './CabinetConfiguration';
import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import Libraries from './libraries/Libraries';
import Preferences from './preferences/Preferences';
import SettingsEditor from './SettingsEditor';
import { SettingsContext } from '../layout/SettingsProvider';
import RestrictionModes from './content/RestrictionModes';
import CategoryList from './categories/CategoryList';
import Skins from './skins/Skins';
import PinEntry from '../common/PinEntry';
import { applyLighting } from '../../lib/lightingHelper';
import './Settings.scss';
import LogList from './logs/LogList';
import Metadata from './metadata/Metadata';

const Settings = () => {
  const settings = useContext(SettingsContext);
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [controls, setControls] = useState([]);
  const [searchParams] = useSearchParams();
  const { controlButtonSize } = settings.styles || {};
  const { preferences } = settings || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

  useEffect(() => {
    if (searchParams.get('mode')) {
      setMode(searchParams.get('mode')!.toUpperCase());
    }

    applyLighting(settings, 'Settings');
  }, []);

  if (settings) {
    if (preferences?.pinEnabled && !isAuthorized && !isPinOpen && !modalClosed) {
      setIsPinOpen(true);
    }
  }

  const controlButton = (buttonMode: any) => (
    <ControlButton
      isSelected={mode === buttonMode}
      width="100%"
      onClick={() => {
        setMode(buttonMode);
        window.location.replace(`/settings?mode=${buttonMode}`);
      }}
      text={buttonMode}
      height={buttonHeight}
      style={{ fontSize }}
    />
  );

  const modes = ['LIBRARY', 'PREFERENCES', 'ACCESS', 'STYLE', 'RESTRICTIONS',
    'CABINET', 'LOGS', 'METADATA', 'CATEGORIES'];

  const leftControls = () => {
    if ((preferences?.pinEnabled && isAuthorized) || !preferences?.pinEnabled) {
      return modes.map(m => controlButton(m));
    }

    return [];
  };

  const content = () => {
    if (isAuthorized || !settings?.preferences?.pinEnabled) {
      return (
        <>
          {mode === 'LIBRARY' && <Libraries />}
          {mode === 'ACCESS' && <SettingsEditor />}
          {mode === 'PREFERENCES' && <Preferences />}
          {mode === 'RESTRICTIONS' && <RestrictionModes />}
          {mode === 'CABINET' && <CabinetConfiguration />}
          {mode === 'LOGS' && <LogList />}
          {mode === 'METADATA' && <Metadata />}
          {mode === 'CATEGORIES' && <CategoryList />}
          {mode === 'STYLE' && (
            <Skins
              // @ts-ignore
              resetControls={() => setControls(leftControls())}
              setControls={setControls}
            />
          )}
        </>
      );
    }

    return <></>;
  };

  if ((isAuthorized || !preferences?.pinEnabled) && !controls) {
    // @ts-ignore
    setControls(leftControls());
  }

  if (isAuthorized || !preferences?.pinEnabled) {
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
