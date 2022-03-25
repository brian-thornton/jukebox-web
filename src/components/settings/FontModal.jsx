import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import Item from '../common/Item';
import Modal from '../common/Modal';
import Paginator from '../common/Paginator';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function FontModal({ isOpen, handleClose, editFont }) {
  const [selectedFont, setSelectedFont] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(10);
  const [realStart, setRealStart] = useState(1);

  useEffect(() => {
    setRealStart(selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize));
  }, [realPageSize]);

  useEffect(() => {
    setRealStart(selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize));
  }, [selectedPage]);

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

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      confirmText={"Apply Font"}
      onConfirm={() => {
        handleClose(selectedFont);
        setSelectedFont(null);
      }}
      title="Select Font"
      body={(
        <Container fluid>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>{availableFonts.slice(realStart, (realStart + realPageSize)).map((f) => {
                const workingFont = selectedFont || editFont;

                return (
                  <Item
                    checked={workingFont === f}
                    includeCheckbox
                    onCheck={() => {
                      setSelectedFont(f);
                    }}
                    text={<div style={{ fontFamily: f }}>{f}</div>}
                  />
                );
              }
              )}</Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                disableRandom
                onPageChange={(page) => setSelectedPage(page)}
                style={{ marginTop: '100px' }}
                selectedPage={selectedPage}
                totalItems={availableFonts.length}
                pageSize={realPageSize}
              />
            </Col>
          </Row>
        </Container>
      )}
    />
  );
}

FontModal.propTypes = propTypes;

export default FontModal;
