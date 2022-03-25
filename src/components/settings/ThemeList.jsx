import { PropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { ListGroup } from 'react-bootstrap';

import Button from '../Button';
import Item from '../common/Item';
import PagedContainer from '../common/PagedContainer';
import {
  getHeight,
  initListPaging,
  nextPage,
  previousPage,
} from '../../lib/pageHelper';
import SkinSaveAsModal from './SkinSaveAsModal';
import { updateSettings } from '../../lib/settings-client';
import { getSkins, deleteSkin } from '../../lib/style-client';
import StyleEditor from './StyleEditor';
import { SettingsContext } from '../layout/SettingsProvider';

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
  const [paging, setPaging] = useState();
  const initialHeight = getHeight();

  if (!skinsLoaded && !skinsLoading) {
    setSkinsLoading(true);
  }

  const loadSkins = () => {
    getSkins().then((data) => {
      setPaging(initListPaging(data.length, 90, initialHeight));
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

  const goBackToThemeList = (applySkin) => {
    if (applySkin) {
      getSkins().then((updatedSkins) => {
        updatedSkins.forEach((skin) => {
          if (skin.name === editSkin.name) {
            setSelectedSkin(skin);
          }
        });

        setSelectedSkin(null);
        setEditSkin(null);
        resetControls();
        loadSkins();
      });
    } else {
      setSelectedSkin(null);
      setEditSkin(null);
      resetControls();
      loadSkins();
    }
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
      return skins.slice(paging.currentPage.start, paging.currentPage.limit).map(skin => (
        <Item
          text={skin.name}
          buttons={(
            <>
              <Button onClick={() => makeCopy(skin)} content="Make a Copy" />
              <Button onClick={() => setEditSkin(skin)} content="Edit" disabled={!skin.isEditable} />
              <Button onClick={() => setSelectedSkin(skin)} content="Use Skin" />
              <Button onClick={() => removeSkin(skin)} content="Delete" disabled={!skin.isEditable} />
            </>
          )}
        />
      ));
    }

    return <></>;
  };

  if (editSkin) {
    return (
      <StyleEditor
        skin={editSkin}
        goBackToThemeList={goBackToThemeList}
        setControls={setControls}
        setSelectedSkin={setSelectedSkin}
      />
    );
  }

  const content = (
    <>
      <ListGroup style={{width: '100%'}}>
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

  if (paging) {
    return (
      <PagedContainer
        paging={paging}
        content={content}
        clientNextPage={() => setPaging(nextPage(paging))}
        clientPreviousPage={() => setPaging(previousPage(paging))}
      />
    );
  }

  return <></>;
}

ThemeList.propTypes = propTypes;

export default ThemeList;
