import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useIdleTimer } from 'react-idle-timer'
import { useNavigate } from 'react-router-dom';
import WebFont from 'webfontloader';
import { gql, useQuery } from "@apollo/client";

import './App.css';
import { getSettings } from './lib/settings-client';
import { getStatus } from './lib/status-client';
import { SettingsContext } from './components/layout/SettingsProvider'
import { status } from './lib/radio-client';
import { supportedFonts } from './lib/styleHelper';
import { updateSettings } from './lib/settings-client';
import JukeboxRoutes from './components/layout/JukeboxRoutes';

const JukeboxFooter = React.lazy(() => import("./components/layout/JukeboxFooter"));
const JukeboxHeader = React.lazy(() => import("./components/layout/JukeboxHeader"));
const PinEntry = React.lazy(() => import("./components/common/PinEntry"));

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
  const isScreenSmall = window.innerWidth < 700;
  console.log(window.outerWidth);
  const screen = {
    isMobile: window.outerWidth <= 480,
    isTablet: window.outerWidth > 480 && window.outerWidth <= 1180,
    isDesktop: window.outerWidth > 1180,
    isTabletOrSmaller: window.outerWidth <= 1180,
  }

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
            setSearch('');
            setTempSearch('');
            setTimeout(() => window.location.replace(`/albums`), 3000);
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
    <Suspense>
      <SettingsContext.Provider value={{ ...settings, isScreenSmall: isScreenSmall, screen }}>
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
            <JukeboxRoutes
              display={display}
              search={search}
              selectedLibraries={selectedLibraries}
              setMediaType={setMediaType}
              setSearch={setSearch}
              setSelectedLibraries={setSelectedLibraries}
              setStartsWithFilter={setStartsWithFilter}
              setTempSearch={setTempSearch}
              startsWithFilter={startsWithFilter}
              tempSearch={tempSearch}
            />
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
    </Suspense>
  );
}

export default App;
