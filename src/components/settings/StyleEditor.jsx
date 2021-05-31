import React, { useState, useEffect, useContext } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import styles from '../styles';
import { deleteSkin, createSkin } from '../../lib/style-client';
import SkinSaveAsModal from './SkinSaveAsModal';
import ColorPicker from './ColorPicker';
import CopyFromModal from './CopyFromModal';
import { SettingsContext } from '../layout/Jukebox';

function StyleEditor({
  skin,
  goBackToThemeList,
  setControls,
}) {
  const settings = useContext(SettingsContext);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorMode, setColorMode] = useState();
  const [allowGradient, setAllowGradient] = useState();
  const [isContextSet, setIsContextSet] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [isCopyFromOpen, setIsCopyFromOpen] = useState(false);
  const [copyTo, setCopyTo] = useState();
  const [colors, setColors] = useState({
    headerColor: skin.headerColor,
    footerColor: skin.footerColor,
    fontColor: skin.fontColor,
    fontWeight: skin.fontWeight,
    backgroundColor: skin.backgroundColor,
    popupBackgroundColor: skin.popupBackgroundColor,
    buttonBackgroundColor: skin.buttonBackgroundColor,
    buttonFontColor: skin.buttonFontColor,
    buttonFontWeight: skin.buttonFontWeight,
    trackBackgroundColor: skin.trackBackgroundColor,
  });

  const buttonProps = {
    style: { ...styles.settings, background: settings.styles.buttonBackgroundColor },
    variant: 'outline-light',
    className: 'float-right',
  };

  const controlButtonProps = {
    style: {
      ...styles.settingsButtonStyle,
      color: settings.styles.fontColor,
      background: settings.styles.buttonBackgroundColor,
    },
    variant: 'outline-light',
    className: 'float-right',
  };

  const controls = () => (
    <React.Fragment>
      <Button {...controlButtonProps} onClick={goBackToThemeList}>Back to Settings</Button>
      <Button {...controlButtonProps} onClick={() => setIsSaveAsModalOpen(true)}>Save As</Button>
    </React.Fragment>
  );

  useEffect(() => {
    if (colorMode) {
      setIsColorModalOpen(true);
    }
  }, colorMode);

  if (!isContextSet) {
    setControls(controls());
    setIsContextSet(true);
  }

  const styleRow = name => (
    <ListGroupItem style={styles.cardStyle}>
      {name}
      <Button
        style={{ float: 'right', width: '100px', background: colors[name] }}
        onClick={() => {
          setColorMode(name);

          const gradientTypes = ['headerColor', 'footerColor', 'backgroundColor', 'popupBackgroundColor', 'buttonBackgroundColor', 'trackBackgroundColor'];

          if (gradientTypes.includes(name)) {
            setAllowGradient(true);
          } else {
            setAllowGradient(false);
          }
        }}
      >
        &nbsp;
      </Button>
      <Button
        {...buttonProps}
        onClick={() => {
          setCopyTo(name);
          setIsCopyFromOpen(true);
        }}
      >
        Copy From
      </Button>
    </ListGroupItem>
  );

  const handleColorCopy = (color) => {
    const updated = {
      ...colors,
      [copyTo]: color,
    };

    setColors(updated);
  };

  const handleSetColor = (color) => {
    setIsColorModalOpen(false);

    const updated = {
      ...colors,
      [colorMode]: color,
    };

    setColors(updated);

    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.styles[colorMode] = color;
    setColorMode(null);
  };

  useEffect(() => {
    deleteSkin(skin.name).then(() => {
      createSkin({ name: skin.name, skin: { name: skin.name, ...colors } }).then(() => {
      });
    });
  }, [colors]);

  const content = () => (
    <React.Fragment>
      <ListGroup>
        {styleRow('headerColor')}
        {styleRow('footerColor')}
        {styleRow('fontColor')}
        {styleRow('backgroundColor')}
        {styleRow('popupBackgroundColor')}
        {styleRow('buttonBackgroundColor')}
        {styleRow('buttonTextColor')}
        {styleRow('trackBackgroundColor')}
      </ListGroup>
      <ColorPicker
        isOpen={isColorModalOpen}
        setIsOpen={setIsColorModalOpen}
        color={colors[colorMode]}
        setColor={handleSetColor}
        allowGradient={allowGradient}
      />
      <SkinSaveAsModal
        goBackToThemeList={goBackToThemeList}
        handleHide={() => setIsSaveAsModalOpen(false)}
        isOpen={isSaveAsModalOpen}
        colors={colors}
      />
      <CopyFromModal
        isOpen={isCopyFromOpen}
        colors={colors}
        handleHide={() => setIsCopyFromOpen(false)}
        handleCopyColor={handleColorCopy}
      />
    </React.Fragment>
  );

  return content();
}
export default StyleEditor;
