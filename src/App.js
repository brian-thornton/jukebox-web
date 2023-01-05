import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer'
import { useNavigate } from 'react-router-dom';
import WebFont from 'webfontloader';

import './App.css';
import { getSettings } from './lib/settings-client';
import { getStatus } from './lib/status-client';
import { SettingsContext } from './components/layout/SettingsProvider'
import { status } from './lib/radio-client';
import { supportedFonts } from './lib/styleHelper';
import { updateSettings } from './lib/settings-client';
import AlbumDetail from './components/albums/AlbumDetail';
import AlbumList from './components/albums/AlbumList';
import Filters from './components/layout/Filters';
import JukeboxFooter from './components/layout/JukeboxFooter';
import JukeboxHeader from './components/layout/JukeboxHeader';
import PinEntry from './components/common/PinEntry';
import PlaylistsViewer from './components/playlists/PlaylistsViewer';
import Queue from './components/Queue';
import RadioList from './components/radio/RadioList';
import Search from './components/common/Search';
import Settings from './components/settings/Settings';
import Tracks from './components/Tracks';
import WithKeyboardInput from './components/layout/WithKeyboardInput';

function App() {
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [settings, setSettings] = useState();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [search, setSearch] = useState();
  const [display, setDisplay] = useState('covers');
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [nowPlaying, setNowPlaying] = useState('');
  const [mediaType, setMediaType] = useState('file');
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [background, setBackground] = useState();
  const [lastModule, setLastModule] = useState('albums');
  const [isLocked, setIsLocked] = useState();
  const [startsWithFilter, setStartsWithFilter] = useState();
  const navigate = useNavigate();
  const isScreenSmall= window.innerWidth < 700;

  const onIdle = () => {
    setSearch('');
    navigate(`/albums`);
  };

  // Monitor user idle to return to home screen.
  const idleTimer = useIdleTimer({ onIdle, timeout: 1000 * 60 * 3 });

  // Monitor for remote lock down.
  const monitorLock = () => {
    getSettings().then((data) => {
      if (!settingsRef.current || (data.features.isLocked !== settingsRef.current.features.isLocked)) {
        setSettings(data);

        if (data) {
          setIsLocked(data.features.isLocked);

          // The lock has been set and the user is not on the albums page. Return the user
          // to the home page.
          if (data.features.isLocked && window.location.pathname !== '/albums') {
            window.location.replace(`/albums`);
          }
        }
      }

      setTimeout(() => monitorLock(), 3000);
    });
  };

  useEffect(() => {
    getSettings().then((data) => setSettings(data));
    WebFont.load(supportedFonts);
    monitorLock();
  }, []);

  useEffect(() => {
    if (!search) {
      setStartsWithFilter(null);
    }
  }, [search]);

  const startPlaybackWatchers = () => {
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

        const { preferences } = settings;
        const { vlcHost, vlcPort, vlcPassword } = preferences;
        status(vlcHost, vlcPort, vlcPassword).then((radioData) => {
          const isRadioPlaying = radioData?.state === 'playing';

          if (isRadioPlaying) {
            const metadata = radioData?.information?.category?.meta;
            setNowPlaying(metadata?.now_playing || metadata?.filename);
          }
        }).catch(e => console.log(e));
      }, 3000);
    }
  };

  useEffect(() => {
    if (settings) {
      startPlaybackWatchers();
    }
  }, [settings]);

  const wrapWithKeyboard = (component) => (
    <WithKeyboardInput
      component={component}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      debouncedSearch={setSearch}
    />
  );

  useEffect(() => {
    if (settings) {
      let bg = settings.styles.backgroundColor;

      if (settings.styles.wallpaper) {
        bg = `url(${settings.styles.wallpaper})`;
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

  const updateFeature = (name, value, redirectTo) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    updateSettings(deepClone).then(() => {
      if (!redirectTo) {
        window.location.reload();
      } else {
        navigate(redirectTo);
      }
    });
  };

  const JukeboxRoot = ({ children }) => (
    <div style={{
      ...background,
      height: window.innerHeight - 60,
    }}>
      {children}
    </div>
  );  

  return (
    <>
      <SettingsContext.Provider value={{ ...settings, isScreenSmall: isScreenSmall, }}>
        {settings && isPinOpen && (
          <JukeboxRoot>
            <PinEntry
              onAuthorize={() => {
                getSettings().then((data) => {
                  updateFeature('isLocked', !data.features.isLocked, '/albums');
                  setIsPinOpen(false)
                });
              }}
              onCancel={() => setIsPinOpen(false)}
            />
          </JukeboxRoot>
        )}
        {settings && !isPinOpen && (
          <JukeboxRoot>
            <JukeboxHeader
              display={display}
              setDisplay={setDisplay}
              setSelectedLibraries={setSelectedLibraries}
              selectedLibraries={selectedLibraries}
              search={search}
              setSearch={setSearch}
              setLastModule={setLastModule}
              clearSearch={() => {
                setSearch('');
                setTempSearch('');
              }}
              lastModule={lastModule}
              setIsLocked={(value) => {
                setIsLocked(value);
                updateFeature('isLocked', value);
              }}
              setIsPinOpen={setIsPinOpen}
            />
            <Routes>
              <Route path="/" element={wrapWithKeyboard(<AlbumList selectedLibraries={selectedLibraries} search={search} setStartsWithFilter={setStartsWithFilter} startsWithFilter={startsWithFilter} display={display} />)} />
              <Route path="/albums" element={wrapWithKeyboard(<AlbumList setStartsWithFilter={setStartsWithFilter} startsWithFilter={startsWithFilter} selectedLibraries={selectedLibraries} display={display} search={search} />)} />
              <Route path="/albums/:id" element={<AlbumDetail />} />
              <Route path="/albums/categories/:id" element={<AlbumList />} search={search} display={display} />
              <Route path="/filters" element={<Filters selectedLibraries={selectedLibraries} setSelectedLibraries={setSelectedLibraries} />} />
              <Route path="/playlists" element={<PlaylistsViewer />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/search" element={<Search setSearchText={setSearch} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tracks" element={wrapWithKeyboard(<Tracks setSearch={setSearch} search={search} />)} />
              <Route path="/radio" element={wrapWithKeyboard(<RadioList setMediaType={setMediaType} />)} />
            </Routes>
            <JukeboxFooter
              mediaType={mediaType}
              setMediaType={setMediaType}
              search={search}
              setSearch={setSearch}
              nowPlaying={nowPlaying}
            />
          </JukeboxRoot>
        )}
      </SettingsContext.Provider>
    </>
  );
}

export default App;
