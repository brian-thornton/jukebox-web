import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import styles from '../styles';
import SettingsClient from '../../lib/settings-client';
import StyleClient from '../../lib/style-client';
import StyleEditor from './StyleEditor';
import { Settings } from '../shapes';

const propTypes = {
  settings: Settings.isRequired,
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

function ThemeList({ settings, resetControls, setControls }) {
  const [skins, setSkins] = useState();
  const [selectedSkin, setSelectedSkin] = useState();
  const [skinsLoaded, setSkinsLoaded] = useState(false);
  const [skinsLoading, setSkinsLoading] = useState(false);
  const [editSkin, setEditSkin] = useState();

  if (!skinsLoaded && !skinsLoading) {
    setSkinsLoading(true);
  }

  const loadSkins = () => {
    StyleClient.getSkins().then((data) => {
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
    if (settings && selectedSkin) {
      const deepClone = JSON.parse(JSON.stringify(settings));
      deepClone.styles.headerColor = selectedSkin.headerColor;
      deepClone.styles.footerColor = selectedSkin.footerColor;
      deepClone.styles.fontColor = selectedSkin.fontColor;
      deepClone.styles.fontWeight = selectedSkin.fontWeight;
      deepClone.styles.backgroundColor = selectedSkin.backgroundColor;
      deepClone.styles.popupBackgroundColor = selectedSkin.popupBackgroundColor;
      deepClone.styles.buttonBackgroundColor = selectedSkin.buttonBackgroundColor;
      deepClone.styles.buttonFontColor = selectedSkin.buttonFontColor;
      deepClone.styles.buttonFontWeight = selectedSkin.buttonFontWeight;
      deepClone.styles.trackBackgroundColor = selectedSkin.trackBackgroundColor;

      SettingsClient.updateSettings(deepClone).then(() => {
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

  const deleteSkin = (skin) => {
    StyleClient.deleteSkin(skin.name).then(() => {
      loadSkins();
    });
  };

  const skinRows = () => {
    if (skins && skins.length) {
      const rows = [];

      const buttonProps = {
        style: { ...styles.buttonStyle, background: settings.styles.buttonBackgroundColor },
        variant: 'outline-light',
        className: 'float-right',
      };


      skins.forEach((skin) => {
        const controlButtonProps = {
          ...buttonProps
        };

        if (!skin.isEditable) {
          console.log(`${skin.name}: ${skin.isEditable}`);
          controlButtonProps.disabled = true;
        }

        rows.push(
          <ListGroupItem style={styles.cardStyle}>
            {skin.name}
            <Button {...controlButtonProps} onClick={() => setEditSkin(skin)}>Edit</Button>
            <Button {...buttonProps} onClick={() => setSelectedSkin(skin)}>Use Skin</Button>
            <Button {...controlButtonProps} onClick={() => deleteSkin(skin)}>Delete</Button>
          </ListGroupItem>,
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
        settings={settings}
        goBackToThemeList={goBackToThemeList}
        setControls={setControls}
      />
    );
  }

  if (skins && skins.length) {
    return (
      <ListGroup>
        {skinRows()}
      </ListGroup>
    );
  }

  return <React.Fragment />;
}

ThemeList.propTypes = propTypes;

export default ThemeList;
