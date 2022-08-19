import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { useSwipeable } from 'react-swipeable';

import Item from '../../common/Item';
import Paginator from '../../common/Paginator';
import { supportedFonts } from '../../../lib/styleHelper';
import { pageSize } from '../../../lib/styleHelper';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import { handlers } from '../../../lib/gesture-helper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const FontPicker = ({ editFont, skin, onComplete }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const availableFonts = supportedFonts.google.families;
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  useEffect(() => setItemsPerPage(pageSize('item', 300)), []);

  const updateFont = (fontName) => {
    deleteSkin(skin.name).then(() => {
      const newObject = {
        ...skin,
        [editFont]: fontName,
      };

      createSkin({
        name: newObject.name,
        skin: newObject,
      }).then(onComplete);
    });
  };

  return (
    <Container fluid {...swipe}>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row>{availableFonts.slice(start, (start + itemsPerPage)).map((f) => {
            return (
              <Item
                checked={skin[editFont] === f}
                includeCheckbox
                onCheck={() => updateFont(f)}
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
            pageSize={itemsPerPage}
          />
        </Col>
      </Row>
    </Container>
  );
}

FontPicker.propTypes = propTypes;

export default FontPicker;
