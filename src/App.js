import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { debounce } from 'lodash';
import WebFont from 'webfontloader';

import './App.css';
import AlbumDetail from './components/albums/AlbumDetail';
import AlbumList from './components/albums/AlbumList';
import { getSettings } from './lib/settings-client';
import { getStatus } from './lib/status-client';
import Filters from './components/layout/Filters';
import JukeboxFooter from './components/layout/JukeboxFooter';
import JukeboxHeader from './components/layout/JukeboxHeader';
import PinEntry from './components/common/PinEntry';
import PlaylistsViewer from './components/playlists/PlaylistsViewer';
import Queue from './components/Queue';
import Search from './components/common/Search';
import Settings from './components/settings/Settings';
import Tracks from './components/Tracks';
import { SettingsContext } from './components/layout/SettingsProvider'
import WithKeyboardInput from './components/layout/WithKeyboardInput';
import { supportedFonts } from './lib/styleHelper';
import { updateSettings } from './lib/settings-client';

function App() {
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [settings, setSettings] = useState();
  const [search, setSearch] = useState();
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [nowPlaying, setNowPlaying] = useState('');
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [background, setBackground] = useState();
  const [lastModule, setLastModule] = useState('albums');
  const [isLocked, setIsLocked] = useState();

  useEffect(() => WebFont.load(supportedFonts), []);

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

  useEffect(() => {
    if (settings) {
      let bg = settings.styles.backgroundColor;

      if (localStorage["jukebox-wallpaper"]) {
        bg = `url(${localStorage["jukebox-wallpaper"]})`;
        setBackground({
          backgroundImage: bg,
          backgroundSize: '100% 100%',
        });
      } else {
        setBackground({
          background: settings.styles.backgroundColor,
        })
      }
    }
  }, [settings])

  const handlePinAction = (onAuthorized) => {
    setIsPinOpen(true);
  }

  useEffect(() => {
    //setIsPinOpen(true);
  }, [isLocked])

  const updateFeature = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  return (
    <>
      <SettingsContext.Provider value={settings}>
        {settings && isPinOpen && (
          <div style={{
            ...background,
            height: window.innerHeight - 60,
          }}>
            <PinEntry
              onAuthorize={() => updateFeature('isLocked', isLocked)}
              onCancel={() => setIsPinOpen(false)}
            />
          </div>
        )}
        {settings && !isPinOpen && (
          <>
            <div style={{
              ...background,
              height: window.innerHeight - 60,
            }}>
              <JukeboxHeader
                setSelectedLibraries={setSelectedLibraries}
                selectedLibraries={selectedLibraries}
                search={search}
                setSearch={setSearch}
                setLastModule={setLastModule}
                lastModule={lastModule}
                setIsLocked={setIsLocked}
                setIsPinOpen={setIsPinOpen}
              />
              <Routes>
                <Route path="/" element={wrapWithKeyboard(<AlbumList selectedLibraries={selectedLibraries} search={search} />)} />
                <Route path="/albums" element={wrapWithKeyboard(<AlbumList selectedLibraries={selectedLibraries} search={search} />)} />
                <Route path="/albums/:id" element={<AlbumDetail />} />
                <Route path="/albums/categories/:id" element={<AlbumList />} search={search} />
                <Route path="/filters" element={<Filters selectedLibraries={selectedLibraries} setSelectedLibraries={setSelectedLibraries} />} />
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
          </>
        )}
      </SettingsContext.Provider>
    </>
  );
}

export default App;
