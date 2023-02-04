import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Paginator from '../common/Paginator';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { calculatePageSize } from '../../lib/styleHelper';
import ToggleRow from './ToggleRow';

const SettingsEditor = () => {
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
    { key: 'isLocked', value: <FormattedMessage id="lock_system" /> },
    { key: 'albums', value: <FormattedMessage id="view_albums" /> },
    { key: 'tracks', value: <FormattedMessage id="view_tracks" /> },
    { key: 'playlists', value: <FormattedMessage id="view_run_playlists" /> },
    { key: 'radio', value: <FormattedMessage id="play_radio" /> },
    { key: 'queue', value: <FormattedMessage id="view_update_queue" /> },
    { key: 'settings', value: <FormattedMessage id="view_settings" /> },
    { key: 'volume', value: <FormattedMessage id="control_volume" /> },
    { key: 'next', value: <FormattedMessage id="advance" /> },
    { key: 'stop', value: <FormattedMessage id="stop_playback" /> },
    { key: 'play', value: <FormattedMessage id="start_playback" /> },
    { key: 'playNow', value: <FormattedMessage id="play_now" /> },
    { key: 'enqueue', value: <FormattedMessage id="add_to_queue" /> },
    { key: 'playAlbum', value: <FormattedMessage id="play_entire_album" /> },
    { key: 'addToPlaylist', value: <FormattedMessage id="add_to_playlists" /> },
    { key: 'deletePlaylist', value: <FormattedMessage id="delete_playlist" /> },
    { key: 'admin', value: <FormattedMessage id="access_admin" /> },
    { key: 'downloadTrack', value: <FormattedMessage id="download_track" /> },
  ];

  const settingRow = (name) => {
    const displayName = displayNames.find(entry => entry.key === name);

    return (
      <ToggleRow
        description={displayName?.value || name}
        keys={['on', 'off']}
        selectedKey={settings.features[name] === true ? 'on' : 'off'}
        onSetKey={updatedValue => updateFeature(name, updatedValue === 'on')}
      />
    );
  };

  if (features) {
    return (
      <>
        {features.slice(realStart, (realStart + realPageSize)).map(key => (
          settingRow(key)))}
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
