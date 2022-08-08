import { PropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';

import AddNew from '../common/AddNew';
import { createSkin } from '../../lib/style-client';
import { updateSettings } from '../../lib/settings-client';
import { getSkins } from '../../lib/style-client';
import SkinDetail from './SkinDetail';
import { SettingsContext } from '../layout/SettingsProvider';
import { deepCloneSkin } from '../../lib/styleHelper';
import SkinList from './SkinList';

const propTypes = {
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

const Skins = ({ resetControls, setControls }) => {
  const settings = useContext(SettingsContext);
  const [skins, setSkins] = useState();
  const [selectedSkin, setSelectedSkin] = useState();
  const [skinsLoaded, setSkinsLoaded] = useState(false);
  const [skinsLoading, setSkinsLoading] = useState(false);
  const [editSkin, setEditSkin] = useState();
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [copySkinBase, setCopySkinBase] = useState();

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
      const deepClone = deepCloneSkin(settings, selectedSkin);

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

  const makeCopy = (skin) => {
    setCopySkinBase(skin);
    setIsSaveAsOpen(true);
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
    const { name, isEditable, ...colors } = copySkinBase;

    createSkin({
      name: data.name,
      skin: {
        name: data.name,
        isEditable: true,
        ...colors
      },
    }).then(() => {
      setIsSaveAsOpen(false);
      loadSkins();
    });
  };

  if (skins?.length) {
    return (
      <>
        {!isSaveAsOpen && (
          <SkinList
            skins={skins}
            reloadSkins={loadSkins}
            onCopy={makeCopy}
            setEditSkin={setEditSkin}
            setSelectedSkin={setSelectedSkin}
          />
        )}
        {isSaveAsOpen && (
          <AddNew
            title={`Save ${copySkinBase.name} as...`}
            defaultValue={`${copySkinBase.name} Copy`}
            fields={{ name: 'Name' }}
            onCancel={() => setIsSaveAsOpen(false)}
            onConfirm={(data) => handleSkinSaveAs(data)}
          />
        )}
      </>
    );
  }

  return <></>;
}

Skins.propTypes = propTypes;

export default Skins;
