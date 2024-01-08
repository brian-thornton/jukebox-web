import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CabinetConfiguration from './CabinetConfiguration';
import ContentWithControls from '../common/ContentWithControls/ContentWithControls';
import ControlButton from '../common/ControlButton/ControlButton';
import Libraries from './libraries/Libraries/Libraries';
import Preferences from './preferences/Preferences/Preferences';
import Features from './features/Features';
import { SettingsContext } from '../layout/SettingsProvider';
import RestrictionModes from './content/RestrictionModes/RestrictionModes';
import CategoryList from './categories/CategoryList/CategoryList';
import Skins from './skins/Skins/Skins';
import PinEntry from '../common/PinEntry/PinEntry';
import { applyLighting } from '../../lib/helper/lightingHelper';
import styles from './Settings.module.css';
import LogList from './logs/LogList/LogList';
import Metadata from './metadata/Metadata/Metadata';
import SettingsActions from './SettingsActions';
import Button from '../common/Button/Button';

const Settings = () => {
  const settings = useContext(SettingsContext);
  const [mode, setMode] = useState('LIBRARY');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [controls, setControls] = useState([]);
  const [searchParams] = useSearchParams();
  const { controlButtonSize } = settings.styles || {};
  const { preferences, screen } = settings || {};
  const [actionsOpen, setActionsOpen] = useState(false);
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';

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
    />
  );

  const modes = ['LIBRARY', 'PREFERENCES', 'FEATURES', 'STYLE', 'RESTRICTIONS',
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
          {mode === 'FEATURES' && <Features />}
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

  if (screen?.isMobile) {
    return (
      <div style={{paddingTop: '60px'}}>
        {!actionsOpen && <Button style={{fontSize: '20px'}} content="..." onClick={() => setActionsOpen(true)} />}
        {actionsOpen && <SettingsActions setMode={setMode} onClose={() => setActionsOpen(false)} />}
        {!actionsOpen && content()}
      </div>
    );
  }

  if (isAuthorized || !preferences?.pinEnabled) {
    return <ContentWithControls controls={leftControls()} content={content()} />;
  }

  return (!isAuthorized && (
    <div className={styles.settingsPinContainer}>
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
