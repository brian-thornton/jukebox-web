import React, { useContext, useEffect, useState } from 'react';

import Button from '../Button';
import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { pageSize } from '../../lib/styleHelper'; 

const SettingsEditor = () => {
  const [features, setFeatures] = useState();
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  useEffect(() => setRealPageSize(pageSize('item', 300)), []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  const updateFeature = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const loadSettings = () => {
    const data = Object.keys(settings.features);
    setFeatures(data);
  }

  useEffect(loadSettings, []);

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';

    return (
      <Item
        buttons={(
          <Button
            onClick={() => updateFeature(name, !value)}
            isToggle
            isToggled={value}
            content={buttonText}
          />
        )}
        text={name}
      />
    );
  };

  if (features) {
    return (
      <>
        {features.slice(realStart, (realStart + realPageSize)).map(key => settingRow(key, settings.features[key]))}
        <Paginator
          disableRandom
          onPageChange={(page) => setSelectedPage(page)}
          selectedPage={selectedPage}
          totalItems={features.length}
          pageSize={realPageSize}
        />
      </>
    );
  }

  return <></>;

}
export default SettingsEditor;
