import React, { useContext, useEffect, useState } from 'react';

import Button from '../Button';
import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { calculatePageSize } from '../../lib/styleHelper';
import { injectIntl } from 'react-intl';

const SettingsEditor = ({ intl }) => {
  const [features, setFeatures] = useState();
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  useEffect(() => setRealPageSize(calculatePageSize('item', 300)), []);

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
    { key: 'isLocked', value: intl.formatMessage({ id: 'lock_system' }) },
    { key: 'albums', value: intl.formatMessage({ id: 'view_albums' }) },
    { key: 'tracks', value: intl.formatMessage({ id: 'view_tracks' }) },
    { key: 'playlists', value: intl.formatMessage({ id: 'view_run_playlists' }) },
    { key: 'radio', value: intl.formatMessage({ id: 'play_radio' }) },
    { key: 'queue', value: intl.formatMessage({ id: 'view_update_queue' }) },
    { key: 'settings', value: intl.formatMessage({ id: 'view_settings' }) },
    { key: 'volume', value: intl.formatMessage({ id: 'control_volume' }) },
    { key: 'next', value: intl.formatMessage({ id: 'advance' }) },
    { key: 'stop', value: intl.formatMessage({ id: 'stop_playback' }) },
    { key: 'play', value: intl.formatMessage({ id: 'start_playback' }) },
    { key: 'playNow', value: intl.formatMessage({ id: 'play_now' }) },
    { key: 'enqueue', value: intl.formatMessage({ id: 'add_to_queue' }) },
    { key: 'playAlbum', value: intl.formatMessage({ id: 'play_entire_album' }) },
    { key: 'addToPlaylist', value: intl.formatMessage({ id: 'add_to_playlists' }) },
    { key: 'deletePlaylist', value: intl.formatMessage({ id: 'delete_playlist' }) },
    { key: 'admin', value: intl.formatMessage({ id: 'access_admin' }) },
    { key: 'downloadTrack', value: intl.formatMessage({ id: 'download_track' }) },
  ];

  const settingRow = (name, value) => {
    const buttonText = intl.formatMessage({id: value ? 'enabled' : 'disabled'});
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

export default injectIntl(SettingsEditor);
