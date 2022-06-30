import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import ColorPicker from './ColorPicker';
import Button from '../Button';
import Paginator from '../common/Paginator';
import styles from './SkinDetail.module.css';
import { deleteSkin, createSkin } from '../../lib/style-client';

const SkinColors = ({ skin }) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(5);
  const [realStart, setRealStart] = useState(1);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorMode, setColorMode] = useState();
  const [allowGradient, setAllowGradient] = useState();
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


  useEffect(() => {
    const numberOfItems = Math.floor((window.innerHeight - 200) / 50);
    setRealPageSize(numberOfItems);
  }, []);

  useEffect(() => {
    deleteSkin(skin.name).then(() => {
      createSkin({
        name: skin.name,
        skin: { isEditable: skin.isEditable, name: skin.name, ...colors },
      }).then(() => { });
    });
  }, [colors]);

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

  const styleRow = (name, display) => (
    <Item
      text={display}
      buttons={(
        <>
          <Button
            style={{ float: 'right', width: '100px', background: colors[name] }}
            onClick={() => {
              setIsColorModalOpen(true);
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
          {/* <Button
            {...buttonProps(settings)}
            onClick={() => {
              setCopyTo(name);
              setIsCopyFromOpen(true);
            }}
            content="Copy From"
          /> */}
        </>
      )}
    />
  );

  const rows = [
    styleRow('headerColor', 'Header Background Color'),
    styleRow('headerColor', 'Header Background Color'),
    styleRow('footerColor', 'Footer Background Color'),
    styleRow('fontColor', 'Font Color'),
    styleRow('backgroundColor', 'Background Color'),
    styleRow('popupBackgroundColor', 'Dialog Background Color'),
    styleRow('buttonBackgroundColor', 'Button Background Color'),
    styleRow('buttonTextColor', 'Button Text Color'),
    styleRow('trackBackgroundColor', 'Track Background Color'),
  ];

  return (
    <>
      {isColorModalOpen && (
        <ColorPicker
          isOpen={isColorModalOpen}
          setIsOpen={setIsColorModalOpen}
          color={colors[colorMode]}
          setColor={handleSetColor}
          allowGradient={allowGradient}
        />
      )}
      {!isColorModalOpen && <Container fluid className={styles.styleEditorContent}>
        <Row>
          <Col lg="12" xl="12" md="12" sm="12">
            <Row>
              <ListGroup className={styles.styleEditorContent}>
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
              selectedPage={selectedPage}
              totalItems={12}
              pageSize={realPageSize}
            />
          </Col>
        </Row>
      </Container>
      }
    </>
  );
};

export default SkinColors;