import { PropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';

import { card } from '../../lib/styleHelper';
import Item from '../common/Item';
import SkinSaveAsModal from './SkinSaveAsModal';
import styles from '../styles';
import { updateSettings } from '../../lib/settings-client';
import { getSkins, deleteSkin } from '../../lib/style-client';
import StyleEditor from './StyleEditor';
import { SettingsContext } from '../layout/Jukebox';

const propTypes = {
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

function ThemeList({ resetControls, setControls }) {
  const settings = useContext(SettingsContext);
  const [skins, setSkins] = useState();
  const [selectedSkin, setSelectedSkin] = useState();
  const [skinsLoaded, setSkinsLoaded] = useState(false);
  const [skinsLoading, setSkinsLoading] = useState(false);
  const [editSkin, setEditSkin] = useState();
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [copyFromColors, setCopyFromColors] = useState();

  if (!skinsLoaded && !skinsLoading) {
    setSkinsLoading(true);
  }

  const loadSkins = () => {
    getSkins().then((data) => {
      setSkinsLoading(false);
      setSkinsLoaded(true);
      setSkins(data);
    });
  };

  useEffect(() => {
    if (!skinsLoaded && skinsLoading) {
      loadSkins();
    }
  }, [skinsLoading]);

  useEffect(() => {
    if (selectedSkin) {
      const deepClone = JSON.parse(JSON.stringify(settings));
      deepClone.styles.headerColor = selectedSkin.headerColor;
      deepClone.styles.headerFont = selectedSkin.headerFont;
      deepClone.styles.footerColor = selectedSkin.footerColor;
      deepClone.styles.footerFont = selectedSkin.footerFont;
      deepClone.styles.fontColor = selectedSkin.fontColor;
      deepClone.styles.fontWeight = selectedSkin.fontWeight;
      deepClone.styles.backgroundColor = selectedSkin.backgroundColor;
      deepClone.styles.popupBackgroundColor = selectedSkin.popupBackgroundColor;
      deepClone.styles.buttonBackgroundColor = selectedSkin.buttonBackgroundColor;
      deepClone.styles.buttonFont = selectedSkin.buttonFont;
      deepClone.styles.buttonFontColor = selectedSkin.buttonFontColor;
      deepClone.styles.buttonFontWeight = selectedSkin.buttonFontWeight;
      deepClone.styles.trackBackgroundColor = selectedSkin.trackBackgroundColor;
      deepClone.styles.listFont = selectedSkin.listFont;

      updateSettings(deepClone).then(() => {
        window.location.reload();
      });
    }
  }, [selectedSkin]);

  const goBackToThemeList = () => {
    setSelectedSkin(null);
    setEditSkin(null);
    resetControls();
    loadSkins();
  };

  const removeSkin = (skin) => {
    deleteSkin(skin.name).then(() => {
      loadSkins();
    });
  };

  const makeCopy = (skin) => {
    setCopyFromColors({
      headerColor: skin.headerColor,
      footerColor: skin.footerColor,
      fontColor: skin.fontColor,
      fontWeight: skin.fontWeight,
      backgroundColor: skin.backgroundColor,
      popupBackgroundColor: skin.popupBackgroundColor,
      buttonBackgroundColor: skin.buttonBackgroundColor,
      buttonFontColor: skin.buttonFontColor,
      buttonFontWeight: skin.buttonFontWeight,
      trackBackgroundColor: skin.trackBackgroundColor,
      listFont: skin.listFont,
    });

    setIsSaveAsOpen(true);
  };

  const skinRows = () => {
    if (skins && skins.length) {
      const rows = [];

      const buttonProps = {
        style: { ...styles.buttonStyle, background: settings.styles.buttonBackgroundColor, fontFamily: settings.styles.buttonFont },
        variant: 'outline-light',
        className: 'float-right',
      };


      skins.forEach((skin) => {
        const controlButtonProps = {
          ...buttonProps,
        };

        if (!skin.isEditable) {
          controlButtonProps.disabled = true;
        }

        rows.push(
          <Item
            text={skin.name}
            buttons={(
              <>
                <Button {...buttonProps} onClick={() => makeCopy(skin)}>Make a Copy</Button>
                <Button {...controlButtonProps} onClick={() => setEditSkin(skin)}>Edit</Button>
                <Button {...buttonProps} onClick={() => setSelectedSkin(skin)}>Use Skin</Button>
                <Button {...controlButtonProps} onClick={() => removeSkin(skin)}>Delete</Button>
              </>
            )}
          />,
        );
      });

      return rows;
    }

    return <React.Fragment />;
  };

  if (editSkin) {
    return (
      <StyleEditor
        skin={editSkin}
        goBackToThemeList={goBackToThemeList}
        setControls={setControls}
      />
    );
  }

  if (skins && skins.length) {
    return (
      <>
        <ListGroup>
          {skinRows()}
        </ListGroup>
        <SkinSaveAsModal
          goBackToThemeList={goBackToThemeList}
          handleHide={() => setIsSaveAsOpen(false)}
          isOpen={isSaveAsOpen}
          colors={copyFromColors}
        />
      </>
    );
  }

  return <React.Fragment />;
}

ThemeList.propTypes = propTypes;

export default ThemeList;
