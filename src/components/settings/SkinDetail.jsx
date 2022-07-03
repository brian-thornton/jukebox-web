import { Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AddNew from '../common/AddNew';
import Button from '../Button';
import ColorCopy from './ColorCopy';
import ControlButton from '../common/ControlButton';
import { deleteSkin, createSkin } from '../../lib/style-client';
import ColorPicker from './ColorPicker';
import NameInput from '../common/NameInput';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './SkinDetail.module.css';
import SkinColors from './SkinColors';
import SkinFonts from './SkinFonts';

const StyleEditor = ({
  skin,
  goBackToThemeList,
  setControls,
}) => {
  const [updatedName, setUpdatedName] = useState();
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(5);
  const [realStart, setRealStart] = useState(1);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorMode, setColorMode] = useState();
  const [allowGradient, setAllowGradient] = useState();
  const [isContextSet, setIsContextSet] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
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
    controlButtonBackgroundColor: skin.controlButtonBackgroundColor,
    controlButtonFont: skin.controlButtonFont,
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

  const saveSkin = (name = skin.name) => {
    deleteSkin(skin.name).then(() => {
      createSkin({
        name: name,
        skin: { isEditable: skin.isEditable, name: name, ...colors },
      }).then(() => { });
    });
  };

  useEffect(() => {
    deleteSkin(skin.name).then(() => {
      createSkin({
        name: skin.name,
        skin: { isEditable: skin.isEditable, name: skin.name, ...colors },
      }).then(() => { });
    });
  }, [colors]);

  useEffect(() => {
    setRealStart(selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize));
  }, [selectedPage]);

  const handleSkinSaveAs = () => {
    createSkin({ name: document.getElementById('name').value, skin: { ...colors, isEditable: true, name: document.getElementById('name').value } });
    setIsSaveAsModalOpen(false);
  };

  const content = () => (
    <>
      {isSaveAsModalOpen && (
        <AddNew
          onCancel={() => setIsSaveAsModalOpen(false)}
          onConfirm={handleSkinSaveAs}
        />
      )}
      {isColorModalOpen && (
        <Container fluid className={styles.styleEditorContent}>
          <ColorCopy skin={skin} />
        </Container>
      )}
      {!isSaveAsModalOpen && !isColorModalOpen && (
        <Card style={{ background: 'transparent' }}>
          <Card.Title style={{ marginTop: '5px', color: settings.styles.fontColor }}>
            <Container fluid>
              <Row style={{ marginBottom: '0px' }}>
                <Col lg="2" md="2" sm="2">
                  <div style={{ marginTop: '10px' }}>Skin Name:</div>
                </Col>
                <Col lg="9" md="9" sm="9">
                  <NameInput
                    defaultValue={skin.name}
                    onChang
                    e={e => setUpdatedName(e.target.value)}
                  />
                </Col>
                <Col lg="1" md="1" sm="1">
                  <Button style={{marginTop: '0px'}} content="Save" onClick={() => saveSkin(updatedName)} />
                </Col>
              </Row>
            </Container>
          </Card.Title>
          <Tabs>
            <Tab eventKey="colors" title="Skin Colors">
              <SkinColors skin={skin} />
            </Tab>
            <Tab eventKey="fonts" title="Skin Fonts">
              <SkinFonts skin={skin} />
            </Tab>
          </Tabs>
        </Card>
      )}
    </>
  );

  return content();
}
export default StyleEditor;
