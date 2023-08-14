import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import Item from '../../../common/Item/Item';
import FontPicker from '../FontPicker/FontPicker';
import Button from '../../../Button';
import Paginator from '../../../common/Paginator/Paginator';
import { calculatePageSize } from '../../../../lib/styleHelper';
import { handlers } from '../../../../lib/gesture-helper';
import { Skin } from '../../../shapes';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  skin: Skin.isRequired,
};

const SkinFonts = ({ onClose, skin }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [editFont, setEditFont] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
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
    activeButtonColor: skin.activeButtonColor,
    buttonFont: skin.buttonFont,
    buttonFontColor: skin.buttonFontColor,
    buttonFontWeight: skin.buttonFontWeight,
    trackBackgroundColor: skin.trackBackgroundColor,
    listFont: skin.listFont,
  });

  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 70)), []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const fontRow = (name, display) => (
    <Item
      text={display}
      buttons={(
        <Button
          disabled={!skin.isEditable}
          style={{ fontFamily: colors[name] }}
          onClick={() => {
            setEditFont(name);
            setIsFontModalOpen(true);
          }}
          content={colors[name] ? colors[name] : name}
        />
      )}
    />
  );

  const rows = [
    fontRow('listFont', 'List Font'),
    fontRow('headerFont', 'Header Font'),
    fontRow('footerFont', 'Footer Font'),
    fontRow('buttonFont', 'Button Font'),
  ];

  return (
    <>
      {isFontModalOpen && (
        <FontPicker
          onCancel={() => setIsFontModalOpen(null)}
          skin={skin}
          editFont={editFont}
          onComplete={() => {
            setIsFontModalOpen(false);
            window.location.replace(`/settings?skin=${skin.name}&mode=style&tab=fonts`);
          }}
        />
      )}
      {!isFontModalOpen && (
        <Container fluid>
          <Row>
            <Button content="Back to Skin" onClick={onClose} />
          </Row>
          <Row>
            <ListGroup className="styleEditorContent" {...swipe}>
              {rows.slice(start, (start + itemsPerPage)).map(r => r)}
            </ListGroup>
          </Row>
          <Row>
            <Paginator
              disableRandom
              onPageChange={page => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={4}
              pageSize={itemsPerPage}
            />
          </Row>
        </Container>
      )}
    </>
  );
};

SkinFonts.propTypes = propTypes;

export default injectIntl(SkinFonts);
