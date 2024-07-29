import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useIdleTimer } from 'react-idle-timer'
import { useNavigate } from 'react-router-dom';
import WebFont from 'webfontloader';
import { gql, useQuery } from "@apollo/client";
import { bigButtons } from './lib/helper/styleHelper';

import './App.css';
import { getSettings } from './lib/service-clients/settings-client';
import { getStatus } from './lib/service-clients/status-client';
import { SettingsContext } from './components/layout/SettingsProvider'
import { status } from './lib/service-clients/radio-client';
import { supportedFonts } from './lib/helper/styleHelper';
import { updateSettings } from './lib/service-clients/settings-client';
import JukeboxRoutes from './components/layout/JukeboxRoutes';
import { headerFooterReserve } from './lib/helper/styleHelper';

const JukeboxFooter = React.lazy(() => import("./components/layout/Navigation/JukeboxFooter/JukeboxFooter"));
const JukeboxHeader = React.lazy(() => import("./components/layout/Navigation/JukeboxHeader/JukeboxHeader"));
const PinEntry = React.lazy(() => import("./components/common/PinEntry/PinEntry"));

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
  const [fontSize, setFontSize] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const screen = {
    isMobile: window.outerWidth <= 480,
    isTablet: window.outerWidth > 480 && window.outerWidth <= 1180,
    isDesktop: window.outerWidth > 1180,
    isTabletOrSmaller: window.outerWidth <= 1180,
  }

  const calculateRowPageSize = (s) => {
    const reserve = 230;
    const itemHeight = 45;
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    return Math.floor(viewPortHeight / itemHeight);
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
      setFontSize(bigButtons(settings) ? '30px' : '');
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

  const theme = {
    "--background-color": settings?.styles?.backgroundColor,
    "--header-color": settings?.styles?.headerColor,
    "--header-font": settings?.styles?.headerFont,
    "--footer-color": settings?.styles?.footerColor,
    "--font-color": settings?.styles?.fontColor,
    "--font-weight": "normal",
    "--background-color": settings?.styles?.backgroundColor,
    "--popup-background-color": settings?.styles?.popupBackgroundColor,
    "--button-background-color": settings?.styles?.buttonBackgroundColor,
    "--active-button-color": settings?.styles?.activeButtonColor,
    "--button-font": settings?.styles?.buttonFont,
    "--button-font-color": settings?.styles?.buttonFontColor,
    "--button-font-weight": settings?.styles?.buttonFontWeight,
    "--track-background-color": settings?.styles?.trackBackgroundColor,
    "--list-font": settings?.styles?.listFont,
    "--font-size": fontSize,
  }

  console.log(theme)

  return (
    <div style={theme}>
      <Suspense>
        <SettingsContext.Provider value={{ ...settings, isScreenSmall: isScreenSmall, screen, rowPageSize: calculateRowPageSize() }}>
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
    </div>
  );
}

export default App;
