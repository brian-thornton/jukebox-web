import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import Item from '../common/Item';
import FontModal from './FontModal';
import Button from '../Button';
import Paginator from '../common/Paginator';
import styles from './SkinDetail.module.css';

const SkinFonts = ({ skin }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(5);
  const [realStart, setRealStart] = useState(1);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [editFont, setEditFont] = useState();
  const [editProperty, setEditProperty] = useState();
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

  const onUpdateFont = (font) => {
    setColors({ ...colors, [editProperty]: font })
    setIsFontModalOpen(false);
    setEditFont(null);
  }

  const fontRow = (name, display) => {
    return (
      <Item
        text={display}
        buttons={(
          <Button
            style={{ fontFamily: colors[name] }}
            onClick={() => {
              setEditFont(colors[name]);
              setIsFontModalOpen(true);
              setEditProperty(name);
            }}
            content={colors[name] ? colors[name] : name}
          />
        )}
      />
    );
  };

  const rows = [
    fontRow('listFont', 'List Font'),
    fontRow('headerFont', 'Header Font'),
    fontRow('footerFont', 'Footer Font'),
    fontRow('buttonFont', 'Button Font'),
  ];

  return (
    <>
      {isFontModalOpen && (
        <FontModal
          onUpdateFont={onUpdateFont}
          setEditFont={setEditFont}
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
      )}
      {!isFontModalOpen && <Container fluid className={styles.styleEditorContent}>
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

export default SkinFonts;