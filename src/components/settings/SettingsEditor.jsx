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
  };

  useEffect(loadSettings, []);

  const displayNames = [
    { key: 'isLocked', value: 'Lock System' },
    { key: 'albums', value: 'View Albums' },
    { key: 'tracks', value: 'View Tracks' },
    { key: 'playlists', value: 'View and run playlists' },
    { key: 'radio', value: 'Play radio' },
    { key: 'queue', value: 'View and update queue' },
    { key: 'settings', value: 'View settings' },
    { key: 'volume', value: 'Control volume' },
    { key: 'next', value: 'Advance to next track in queue' },
    { key: 'stop', value: 'Stop playback' },
    { key: 'play', value: 'Start playback' },
    { key: 'playNow', value: 'Override queue for immediate playback' },
    { key: 'enqueue', value: 'Add items to the queue' },
    { key: 'playAlbum', value: 'Play and entire album' },
    { key: 'addToPlaylist', value: 'Add items to playlists' },
    { key: 'deletePlaylist', value: 'Delete playlists' },
    { key: 'admin', value: 'Access admin features' },
    { key: 'downloadTrack', value: 'Download a track to a local folder' },
  ];

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';
    const displayName = displayNames.find(entry => entry.key === name);

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
        text={displayName?.value || name}
      />
    );
  };

  if (features) {
    return (
      <>
        {features.slice(realStart, (realStart + realPageSize)).map(key => (
          settingRow(key, settings.features[key])))}
        <Paginator
          disableRandom
          onPageChange={page => setSelectedPage(page)}
          selectedPage={selectedPage}
          totalItems={features.length}
          pageSize={realPageSize}
        />
      </>
    );
  }

  return <></>;
};

export default SettingsEditor;
