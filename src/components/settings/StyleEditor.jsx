import React, { useState, useEffect } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import styles from '../styles';
import StyleClient from '../../lib/style-client';
import SkinSaveAsModal from './SkinSaveAsModal';
import ColorPicker from './ColorPicker';
import CopyFromModal from './CopyFromModal';

function StyleEditor({
  skin,
  settings,
  goBackToThemeList,
  setControls,
}) {
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
    style: { ...styles.settingsButtonStyle, color: settings.styles.fontColor, background: settings.styles.buttonBackgroundColor },
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
    StyleClient.deleteSkin(skin.name).then(() => {
      StyleClient.createSkin({ name: skin.name, skin: { name: skin.name, ...colors } }).then(() => {
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
        settings={settings}
      />
      <SkinSaveAsModal
        goBackToThemeList={goBackToThemeList}
        handleHide={() => setIsSaveAsModalOpen(false)}
        isOpen={isSaveAsModalOpen}
        colors={colors}
        settings={settings}
      />
      <CopyFromModal
        isOpen={isCopyFromOpen}
        colors={colors}
        handleHide={() => setIsCopyFromOpen(false)}
        handleCopyColor={handleColorCopy}
        settings={settings}
      />
    </React.Fragment>
  );

  return content();
}
export default StyleEditor;
