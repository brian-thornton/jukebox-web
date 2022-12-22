import { PropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import AddNew from '../../common/AddNew';
import { createSkin, getSkins } from '../../../lib/style-client';
import { updateSettings } from '../../../lib/settings-client';
import SkinDetail from './SkinDetail';
import { SettingsContext } from '../../layout/SettingsProvider';
import { deepCloneSkin } from '../../../lib/styleHelper';
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
  const [searchParams] = useSearchParams();

  if (!skinsLoaded && !skinsLoading) {
    setSkinsLoading(true);
  }

  const loadSkins = () => {
    getSkins().then((data) => {
      setSkinsLoading(false);
      setSkinsLoaded(true);
      setSkins(data);

      if (searchParams.get('skin')) {
        setEditSkin(data.find(s => s.name === searchParams.get('skin')));
      }
    });
  };

  useEffect(() => {
    if (!skinsLoaded && skinsLoading) {
      loadSkins();
    }
  }, [skinsLoading]);

  const promoteSkin = (s) => {
    if (selectedSkin || s) {
      const deepClone = deepCloneSkin(settings, (selectedSkin || s));

      updateSettings(deepClone).then(() => {
        window.location.reload();
      });
    }
  };

  useEffect(promoteSkin, [selectedSkin]);

  const goBackToThemeList = (applySkin) => {
    if (applySkin) {
      promoteSkin();
      getSkins().then((updatedSkins) => {
        updatedSkins.forEach((skin) => {
          if (skin.name === editSkin.name) {
            setSelectedSkin(skin);
            promoteSkin(skin);
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
        loadSkins={loadSkins}
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
        ...colors,
      },
    }).then(() => {
      setIsSaveAsOpen(false);
      loadSkins();
    });
  };

  if (skins && skins.length > 0) {
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
            onConfirm={data => handleSkinSaveAs(data)}
          />
        )}
      </>
    );
  }

  return <></>;
};

Skins.propTypes = propTypes;

export default Skins;
