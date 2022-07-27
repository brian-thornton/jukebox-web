import { PropTypes } from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect, useContext } from 'react';

import AddNew from '../common/AddNew';
import Button from '../Button';
import { createSkin } from '../../lib/style-client';
import InRowDeleteConfirmation from '../common/InRowDeleteConfirmation';
import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { updateSettings } from '../../lib/settings-client';
import { getSkins, deleteSkin } from '../../lib/style-client';
import SkinDetail from './SkinDetail';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

const ThemeList = ({ resetControls, setControls }) => {
  const settings = useContext(SettingsContext);
  const [skins, setSkins] = useState();
  const [selectedSkin, setSelectedSkin] = useState();
  const [skinsLoaded, setSkinsLoaded] = useState(false);
  const [skinsLoading, setSkinsLoading] = useState(false);
  const [editSkin, setEditSkin] = useState();
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [deleteConfirmSkin, setDeleteConfirmSkin] = useState();
  const [copySkinBase, setCopySkinBase] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

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
      deepClone.styles.controlButtonBackgroundColor = selectedSkin.controlButtonBackgroundColor;
      deepClone.styles.controlButtonFont = selectedSkin.controlButtonFont;
      deepClone.styles.buttonFontColor = selectedSkin.buttonFontColor;
      deepClone.styles.buttonFontWeight = selectedSkin.buttonFontWeight;
      deepClone.styles.trackBackgroundColor = selectedSkin.trackBackgroundColor;
      deepClone.styles.listFont = selectedSkin.listFont;
      deepClone.lighting = selectedSkin.lighting;

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
    setCopySkinBase(skin);
    setIsSaveAsOpen(true);
  };

  const skinRows = () => {
    if (skins && skins.length) {
      return skins.slice(realStart, (realStart + realPageSize)).map(skin => (
        <Item
          text={skin.name}
          buttons={(
            <>
              {deleteConfirmSkin?.name === skin.name && (
                <InRowDeleteConfirmation
                  onCancel={() => setDeleteConfirmSkin(null)}
                  onConfirm={() => {
                    removeSkin(skin);
                    setDeleteConfirmSkin(null);
                  }}
                />
              )}
              {deleteConfirmSkin?.name !== skin.name && (
                <>
                  <Button onClick={() => makeCopy(skin)} content="Make a Copy" />
                  <Button onClick={() => setEditSkin(skin)} content="Edit" disabled={!skin.isEditable} />
                  <Button onClick={() => setSelectedSkin(skin)} content="Use Skin" />
                  <Button onClick={() => setDeleteConfirmSkin(skin)} content="Delete" disabled={!skin.isEditable} />
                </>
              )}
            </>
          )}
        />
      ));
    }

    return <></>;
  };

  if (editSkin) {
    return (
      <SkinDetail
        skin={editSkin}
        goBackToThemeList={goBackToThemeList}
        setControls={setControls}
        setSelectedSkin={setSelectedSkin}
      />
    );
  }

  const handleSkinSaveAs = (data) => {
    const {name, isEditable, ...colors} = copySkinBase;

    createSkin({
      name: data.name,
      skin: {
        name: data.name,
        isEditable: true,
        ...colors },
    }).then(() => {
      setIsSaveAsOpen(false);
      loadSkins();
    });
  };

  if (skins?.length) {
    return (
      <>
        {!isSaveAsOpen && (
        <ListGroup style={{ width: '100%' }}>
          {skinRows()}
        </ListGroup>
        )}
        {isSaveAsOpen && (
          <AddNew
            title={`Save ${copySkinBase.name} as...`}
            defaultValue={`${copySkinBase.name} Copy`}
            fields={{name: 'Name'}}
            onCancel={() => setIsSaveAsOpen(false)}
            onConfirm={(data) => handleSkinSaveAs(data)}
          />
        )}
        <Paginator
          disableRandom
          onPageChange={(page) => setSelectedPage(page)}
          selectedPage={selectedPage}
          totalItems={skins.length}
          pageSize={realPageSize}
        />
      </>
    );
  }

  return <></>;
}

ThemeList.propTypes = propTypes;

export default ThemeList;
