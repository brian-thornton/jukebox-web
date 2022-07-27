import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { supportedFonts } from '../../lib/styleHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const FontModal = ({ editFont, onUpdateFont }) => {
  const [selectedFont, setSelectedFont] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [realStart, setRealStart] = useState(1);
  const availableFonts = supportedFonts.google.families;
  const isScreenSmall = window.innerWidth < 700;

  useEffect(() => {
    setRealStart(selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize));
  }, [realPageSize, selectedPage]);

  useEffect(() => {
    const itemHeight = isScreenSmall ? 90 : 55;
    const viewPortHeight = Math.floor(window.innerHeight - 220);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  return (
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
                  onUpdateFont(f);
                }}
                text={<div style={{ marginTop: '5px', float: 'right', fontFamily: f }}>{f}</div>}
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
            selectedPage={selectedPage}
            totalItems={availableFonts.length}
            pageSize={realPageSize}
          />
        </Col>
      </Row>
    </Container>
  );
}

FontModal.propTypes = propTypes;

export default FontModal;
