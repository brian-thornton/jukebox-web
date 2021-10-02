import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, ListGroup, Button } from 'react-bootstrap';

import ControlButton from '../common/ControlButton';
import Item from '../common/Item';
import { deleteSkin, createSkin } from '../../lib/style-client';
import SkinSaveAsModal from './SkinSaveAsModal';
import ColorPicker from './ColorPicker';
import CopyFromModal from './CopyFromModal';
import { SettingsContext } from '../layout/SettingsProvider';
import { buttonProps } from '../../lib/styleHelper';

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
    headerFont: skin.headerFont,
    footerColor: skin.footerColor,
    footerFont: skin.footerFont,
    fontColor: skin.fontColor,
    fontWeight: skin.fontWeight,
    backgroundColor: skin.backgroundColor,
    popupBackgroundColor: skin.popupBackgroundColor,
    buttonBackgroundColor: skin.buttonBackgroundColor,
    buttonFont: skin.buttonFont,
    buttonFontColor: skin.buttonFontColor,
    buttonFontWeight: skin.buttonFontWeight,
    trackBackgroundColor: skin.trackBackgroundColor,
    listFont: skin.listFont,
  });

  const controls = () => (
    <>
      <ControlButton onClick={goBackToThemeList} text="Back to Settings" />
      <ControlButton onClick={() => setIsSaveAsModalOpen(true)} text="Save As" />
    </>
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

  const styleRow = (name, display) => (
    <Item
      text={display}
      buttons={(
        <>
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
            {...buttonProps(settings)}
            onClick={() => {
              setCopyTo(name);
              setIsCopyFromOpen(true);
            }}
          >
            Copy From
          </Button>
        </>
      )}
    />
  );

  const fontRow = (name, display) => {
    const availableFonts = [
      'Azeret Mono',
      'Audiowide',
      'Black Ops One',
      'Macondo',
      'Roboto Condensed',
      'Oswald',
      'Titillium Web',
      'Bebas Neue',
      'Anton',
      'Josefin Sans',
      'Lobster',
      'Prompt',
      'Cairo',
      'Teko',
      'Architects Daughter',
      'Indie Flower',
      'Balsamiq Sans',
      'Staatliches',
      'Patrick Hand',
      'Permanent Marker',
      'Alfa Slab One',
      'Play',
      'Amatic SC',
      'Cookie',
      'Fredoka One',
      'Righteous',
      'Bangers',
      'Cinzel',
      'Courgette',
      'Luckiest Guy',
      'Jost',
      'Russo One',
      'Orbitron',
      'Press Start 2P',
      'Monoton',
      'Ultra',
      'Rock Salt',
      'Carter One',
      'Unica One',
      'Julius Sans One',
    ];
    const options = availableFonts.map(font => (
      <Dropdown.Item
        onClick={() => setColors({ ...colors, [name]: font })}
        eventKey={font}
        style={{ fontFamily: font }}
      >
        {font}
      </Dropdown.Item>
    ));

    return (
      <Item
        text={display}
        buttons={(
          <Dropdown style={{ float: 'right' }}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ fontFamily: colors[name] }}>
              {colors[name]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {options}
            </Dropdown.Menu>
          </Dropdown>
        )}
      />
    );
  };

  const handleColorCopy = (color) => {
    const updated = {
      ...colors,
      [copyTo]: color,
    };

    setColors(updated);
  };

  const handleSetColor = (color) => {
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
      createSkin({
        name: skin.name,
        skin: { isEditable: skin.isEditable, name: skin.name, ...colors },
      }).then(() => { });
    });
  }, [colors]);

  const content = () => (
    <>
      <ListGroup>
        {fontRow('listFont', 'List Font')}
        {styleRow('headerColor', 'Header Background Color')}
        {fontRow('headerFont', 'Header Font')}
        {styleRow('footerColor', 'Footer Background Color')}
        {fontRow('footerFont', 'Footer Font')}
        {styleRow('fontColor', 'Font Color')}
        {styleRow('backgroundColor', 'Background Color')}
        {styleRow('popupBackgroundColor', 'Dialog Background Color')}
        {styleRow('buttonBackgroundColor', 'Button Background Color')}
        {styleRow('buttonTextColor', 'Button Text Color')}
        {fontRow('buttonFont', 'Button Font')}
        {styleRow('trackBackgroundColor', 'Track Background Color')}
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
    </>
  );

  return content();
}
export default StyleEditor;
