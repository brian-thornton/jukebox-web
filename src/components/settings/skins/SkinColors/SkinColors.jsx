import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useEffect, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FormattedMessage } from 'react-intl';

import ColorCopy from '../ColorCopy/ColorCopy';
import Item from '../../../common/Item/Item';
import { SettingsContext } from '../../../layout/SettingsProvider';
import ColorPicker from '../ColorPicker/ColorPicker';
import Button from '../../../common/Buttons/Button/Button';
import Paginator from '../../../common/Paginator/Paginator';
import { deleteSkin, createSkin } from '../../../../lib/service-clients/style-client';
import { handlers } from '../../../../lib/helper/gesture-helper';
import { Skin } from '../../../shapes';
import styles from './SkinColors.module.css';

const propTypes = {
  skin: Skin.isRequired,
};

const SkinColors = ({ skin, onClose }) => {
  const [isColorCopyOpen, setIsColorCopyOpen] = useState(false);
  const settings = useContext(SettingsContext);
  const { rowPageSize } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
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
    wallpaper: skin.wallpaper,
  });
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);

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
            content={<FormattedMessage id="select_color" />}
          />
          <Button
            disabled={!skin.isEditable}
            onClick={() => {
              setIsColorCopyOpen(true);
            }}
            content={<FormattedMessage id="copy_from" />}
          />
        </>
      )}
    />
  );

  const rows = [
    styleRow('headerColor', <FormattedMessage id="header_background_color" />),
    styleRow('footerColor', <FormattedMessage id="footer_background_color" />),
    styleRow('fontColor', <FormattedMessage id="font_color" />),
    styleRow('backgroundColor', <FormattedMessage id="background_color" />),
    styleRow('popupBackgroundColor', <FormattedMessage id="dialog_background_color" />),
    styleRow('buttonBackgroundColor', <FormattedMessage id="button_background_color" />),
    styleRow('activeButtonColor', <FormattedMessage id="active_button_color" />),
    styleRow('buttonTextColor', <FormattedMessage id="button_text_color" />),
    styleRow('controlButtonBackgroundColor', <FormattedMessage id="control_button_background_color" />),
    styleRow('controlButtonTextColor', <FormattedMessage id="control_button_text_color" />),
    styleRow('trackBackgroundColor', <FormattedMessage id="track_background_color" />),
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
        <div className={styles.skinColorContainer} {...swipe}>
          <Button content="Back to Skin" onClick={onClose} />
          <ListGroup className="styleEditorContent">
            {rows.slice(realStart, (realStart + rowPageSize)).map(r => r)}
          </ListGroup>
          <Paginator
            disableRandom
            onPageChange={page => setSelectedPage(page)}
            selectedPage={selectedPage}
            totalItems={rows.length}
          />
        </div>
      )}
    </>
  );
};

SkinColors.propTypes = propTypes;

export default SkinColors;
