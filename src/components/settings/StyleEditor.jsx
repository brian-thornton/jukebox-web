import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Container, Col, Row, ListGroup } from 'react-bootstrap';
import ControlButton from '../common/ControlButton';
import Item from '../common/Item';
import { deleteSkin, createSkin } from '../../lib/style-client';
import SkinSaveAsModal from './SkinSaveAsModal';
import ColorPicker from './ColorPicker';
import CopyFromModal from './CopyFromModal';
import { SettingsContext } from '../layout/SettingsProvider';
import { buttonProps } from '../../lib/styleHelper';
import FontModal from './FontModal';
import Button from '../Button';
import Paginator from '../common/Paginator';

function StyleEditor({
  skin,
  goBackToThemeList,
  setControls,
  setSelectedSkin,
}) {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(5);
  const [realStart, setRealStart] = useState(1);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [colorMode, setColorMode] = useState();
  const [allowGradient, setAllowGradient] = useState();
  const [editFont, setEditFont] = useState();
  const [editProperty, setEditProperty] = useState();
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
      <ControlButton onClick={() => {
        goBackToThemeList(true);
      }} text="Save and Apply" />
      <ControlButton onClick={() => setIsSaveAsModalOpen(true)} text="Save As" />
    </>
  );

  useEffect(() => {
    if (colorMode) {
      setIsColorModalOpen(true);
    }
  }, colorMode);

  useEffect(() => {
    const numberOfItems = Math.floor((window.innerHeight - 200) / 50);
    setRealPageSize(numberOfItems);
  }, []);

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
            content="Select Color"
          />
          <Button
            {...buttonProps(settings)}
            onClick={() => {
              setCopyTo(name);
              setIsCopyFromOpen(true);
            }}
            content="Copy From"
          />
        </>
      )}
    />
  );

  const fontRow = (name, display) => {
    return (
      <Item
        text={display}
        buttons={(
          <Button
            style={{ fontFamily: colors[name] }}
            onClick={() => {
              setEditFont(colors[name]);
              setEditProperty(name);
            }}
            content={colors[name] ? colors[name] : name}
          />
        )}
      />
    );
  };

  useEffect(() => {
    if (editFont) {
      setIsFontModalOpen(true);
    }
  }, [editFont]);

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

  const rows = [
    fontRow('listFont', 'List Font'),
    styleRow('headerColor', 'Header Background Color'),
    fontRow('headerFont', 'Header Font'),
    styleRow('footerColor', 'Footer Background Color'),
    fontRow('footerFont', 'Footer Font'),
    styleRow('fontColor', 'Font Color'),
    styleRow('backgroundColor', 'Background Color'),
    styleRow('popupBackgroundColor', 'Dialog Background Color'),
    styleRow('buttonBackgroundColor', 'Button Background Color'),
    styleRow('buttonTextColor', 'Button Text Color'),
    fontRow('buttonFont', 'Button Font'),
    styleRow('trackBackgroundColor', 'Track Background Color'),
  ];

  useEffect(() => {
    setRealStart(selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize));
  }, [selectedPage]);

  const content = () => (
    <>
      <Container fluid style={{ width: '100%' }}>
        <Row>
          <Col lg="12" xl="12" md="12" sm="12">
            <Row>
              <ListGroup style={{ width: '100%' }}>
                {rows.slice(realStart, (realStart + realPageSize)).map(r => r)}
              </ListGroup>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg="12" xl="12" md="12" sm="12">
            <Paginator
              disableRandom
              onPageChange={(page) => setSelectedPage(page)}
              style={{ marginTop: '100px' }}
              selectedPage={selectedPage}
              totalItems={12}
              pageSize={realPageSize}
            />
          </Col>
        </Row>
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
        <FontModal
          editFont={editFont}
          onSave={(font) => {
            setColors({ ...colors, [editProperty]: font })
            setIsFontModalOpen(false);
            setEditFont(null);
          }}
          isOpen={isFontModalOpen}
          handleClose={(font) => {
            const updated = {
              ...colors,
              [editProperty]: font,
            };


            setColors(updated);
            setIsFontModalOpen(false);
            setEditFont(null);
            setEditProperty(null);
          }}
        />
      </Container>
    </>
  );

  return content();
}
export default StyleEditor;
