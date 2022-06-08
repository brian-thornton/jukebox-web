import React, { useCallback, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import { debounce } from 'lodash';
import AlbumDetail from './components/albums/AlbumDetail';
import AlbumList from './components/albums/AlbumList';
import { getHeight } from './lib/pageHelper';
import { getSettings } from './lib/settings-client';
import { getStatus } from './lib/status-client';
import JukeboxFooter from './components/layout/JukeboxFooter';
import JukeboxHeader from './components/layout/JukeboxHeader';
import PlaylistsViewer from './components/playlists/PlaylistsViewer';
import Queue from './components/Queue';
import Search from './components/common/Search';
import Settings from './components/settings/Settings';
import Tracks from './components/Tracks';
import { SettingsContext } from './components/layout/SettingsProvider'
import WithKeyboardInput from './components/layout/WithKeyboardInput';

function App() {
  const [tempSearch, setTempSearch] = useState('');
  const [settings, setSettings] = useState();
  const [search, setSearch] = useState();
  const [selectedLibraries, setSelectedLibraries] = useState();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState('');
  const [isIntervalSet, setIsIntervalSet] = useState(false);

  if (!isIntervalSet) {
    setIsIntervalSet(true);
    setInterval(() => {
      getStatus().then((data) => {
        if (data?.nowPlaying && data?.nowPlaying?.name) {
          setNowPlaying(data.nowPlaying.name);
        } else {
          setNowPlaying('');
        }
      });
    }, 3000);
  }

  if (!settings) {
    getSettings().then((data) => {
      setSettings(data);
    });
  }

  const debouncedSearch = useCallback(
    debounce((updatedSearch) => {
      if (updatedSearch.length > 2) {
        setSearch(updatedSearch);
        setTempSearch('');
        window.scrollTo(0, 0);
      }
    }, 1000), [],
  );

  const wrapWithKeyboard = (component) => (
    <WithKeyboardInput
      component={component}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      debouncedSearch={debouncedSearch}
    />
  );

  return (
    <>
      {settings && (
        <SettingsContext.Provider value={settings}>
          <div style={{
            background: settings.styles.backgroundColor,
            height: getHeight() - 60,
          }}>
            <JukeboxHeader
              setSelectedLibraries={setSelectedLibraries}
              selectedLibraries={selectedLibraries}
              search={search}
              setSearch={setSearch}
            />
            <Routes>
              <Route path="/" element={wrapWithKeyboard(<AlbumList search={search} />)} />
              <Route path="/albums" element={wrapWithKeyboard(<AlbumList search={search} />)} />
              <Route path="/albums/:id" element={<AlbumDetail />} />
              <Route path="/playlists" element={<PlaylistsViewer />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/search" element={<Search setSearchText={setSearch} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tracks" element={wrapWithKeyboard(<Tracks setSearch={setSearch} search={search} />)} />
            </Routes>
            <JukeboxFooter
              search={search}
              setSearch={setSearch}
              nowPlaying={nowPlaying}
            />
          </div>
        </SettingsContext.Provider>
      )}
    </>
  );
}

export default App;
