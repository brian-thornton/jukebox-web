import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import { injectIntl } from 'react-intl';

import ColorCopy from './ColorCopy';
import Item from '../../common/Item';
import { SettingsContext } from '../../layout/SettingsProvider';
import ColorPicker from './ColorPicker';
import Button from '../../Button';
import Paginator from '../../common/Paginator';
import './SkinDetail.scss';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import { handlers } from '../../../lib/gesture-helper';
import { Skin } from '../../shapes';
import FullWidthRow from '../../common/FullWidthRow';

const propTypes = {
  skin: Skin.isRequired,
};

const SkinColors = ({ intl, skin }) => {
  const [isColorCopyOpen, setIsColorCopyOpen] = useState(false);
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorMode, setColorMode] = useState();
  const [allowGradient, setAllowGradient] = useState();
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
    controlButtonBackgroundColor: skin.controlButtonBackgroundColor,
    buttonFont: skin.buttonFont,
    buttonFontColor: skin.buttonFontColor,
    buttonFontWeight: skin.buttonFontWeight,
    trackBackgroundColor: skin.trackBackgroundColor,
    listFont: skin.listFont,
    lighting: skin.lighting,
  });
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 250);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
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
            disabled={!skin.isEditable}
            style={{ float: 'right', width: '100px', background: colors[name] }}
            onClick={() => {
              setIsColorModalOpen(true);
              setColorMode(name);

              const gradientTypes = ['headerColor', 'footerColor', 'backgroundColor', 'popupBackgroundColor', 'buttonBackgroundColor', 'activeButtonColor', 'trackBackgroundColor'];

              if (gradientTypes.includes(name)) {
                setAllowGradient(true);
              } else {
                setAllowGradient(false);
              }
            }}
            content={intl.formatMessage({ id: 'select_color' })}
          />
          <Button
            disabled={!skin.isEditable}
            onClick={() => {
              setIsColorCopyOpen(true);
            }}
            content={intl.formatMessage({ id: 'copy_from' })}
          />
        </>
      )}
    />
  );

  const rows = [
    styleRow('headerColor', intl.formatMessage({ id: 'header_background_color' })),
    styleRow('footerColor', intl.formatMessage({ id: 'footer_background_color' })),
    styleRow('fontColor', intl.formatMessage({ id: 'font_color' })),
    styleRow('backgroundColor', intl.formatMessage({ id: 'background_color' })),
    styleRow('popupBackgroundColor', intl.formatMessage({ id: 'dialog_background_color' })),
    styleRow('buttonBackgroundColor', intl.formatMessage({ id: 'button_background_color' })),
    styleRow('activeButtonColor', intl.formatMessage({ id: 'active_button_color' })),
    styleRow('buttonTextColor', intl.formatMessage({ id: 'button_text_color' })),
    styleRow('controlButtonBackgroundColor', intl.formatMessage({ id: 'control_button_background_color' })),
    styleRow('controlButtonTextColor', intl.formatMessage({ id: 'control_button_text_color' })),
    styleRow('trackBackgroundColor', intl.formatMessage({ id: 'track_background_color' })),
  ];

  return (
    <>
      {isColorModalOpen && !isColorCopyOpen && (
        <ColorPicker skin={skin} setColor={handleSetColor} setIsOpen={setIsColorModalOpen} />
      )}
      {!isColorModalOpen && isColorCopyOpen && (
        <ColorCopy
          skin={skin}
        />
      )}
      {!isColorCopyOpen && !isColorModalOpen && (
        <Container fluid className="styleEditorContent" {...swipe}>
          <FullWidthRow>
            <ListGroup className="styleEditorContent">
              {rows.slice(realStart, (realStart + realPageSize)).map(r => r)}
            </ListGroup>
          </FullWidthRow>
          <FullWidthRow>
            <Paginator
              disableRandom
              onPageChange={page => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={rows.length}
              pageSize={realPageSize}
            />
          </FullWidthRow>
        </Container>
      )}
    </>
  );
};

SkinColors.propTypes = propTypes;

export default injectIntl(SkinColors);
