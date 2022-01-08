import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { debounce } from 'lodash';
import { ToastContainer } from 'react-toastify';
import WebFont from 'webfontloader';

import AlbumList from '../albums/AlbumList';
import PlaylistsViewer from '../playlists/PlaylistsViewer';
import AlbumDetail from '../albums/AlbumDetail';
import Queue from '../Queue';
import Tracks from '../Tracks';
import Settings from '../settings/Settings';
import { getSettings } from '../../lib/settings-client';
import { getStatus } from '../../lib/status-client';
import JukeboxFooter from './JukeboxFooter';
import JukeboxHeader from './JukeboxHeader';
import WithKeyboardInput from './WithKeyboardInput';
import { getHeight } from '../../lib/pageHelper';

import './Jukebox.css';
import { SettingsContext } from './SettingsProvider';

function Jukebox() {
  const [category, setCategory] = useState('Albums');
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [tempSearch, setTempSearch] = useState('');
  const [nowPlaying, setNowPlaying] = useState('');
  const [isIntervalSet, setIsIntervalSet] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          'Azeret Mono',
          'Audiowide',
          'Black Ops One',
          'Macondo',
          'Roboto Condensed',
          'Oswald',
          'Titillium Web',
          'Bebas Neue',
          'Anton',
          'Josefin Sans',
          'Lobster',
          'Prompt',
          'Cairo',
          'Teko',
          'Architects Daughter',
          'Indie Flower',
          'Balsamiq Sans',
          'Staatliches',
          'Patrick Hand',
          'Permanent Marker',
          'Alfa Slab One',
          'Play',
          'Amatic SC',
          'Cookie',
          'Fredoka One',
          'Righteous',
          'Bangers',
          'Cinzel',
          'Courgette',
          'Luckiest Guy',
          'Jost',
          'Russo One',
          'Orbitron',
          'Press Start 2P',
          'Monoton',
          'Ultra',
          'Rock Salt',
          'Carter One',
          'Unica One',
          'Julius Sans One',
        ],
      },
    });
  }, []);

  const debouncedSearch = useCallback(
    debounce((updatedSearch) => {
      if (updatedSearch.length > 2) {
        setSearch(updatedSearch);
        setTempSearch('');
        window.scrollTo(0, 0);
      }
    }, 500), [],
  );

  if (!isIntervalSet) {
    setIsIntervalSet(true);
    setInterval(() => {
      getStatus().then((data) => {
        if (data.nowPlaying && data.nowPlaying.name) {
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

  let body = <React.Fragment />;

  const albumList = (
    <AlbumList
      search={search}
      setCurrentAlbum={setCurrentAlbum}
      category={category}
    />
  );

  const trackList = (
    <Tracks
      search={search}
      setCurrentAlbum={setCurrentAlbum}
    />
  );

  if (settings) {
    if (currentAlbum) {
      body = (
        <AlbumDetail
          search={search}
          album={currentAlbum}
          clearCurrentAlbum={() => setCurrentAlbum(null)}
        />
      );
    } else {
      switch (mode) {
        case 'AlbumList':
          body = (
            <WithKeyboardInput
              component={albumList}
              tempSearch={tempSearch}
              setTempSearch={setTempSearch}
              debouncedSearch={debouncedSearch}
            />
          );
          break;
        case 'Tracks':
          body = (
            <WithKeyboardInput
              component={trackList}
              tempSearch={tempSearch}
              setTempSearch={setTempSearch}
              debouncedSearch={debouncedSearch}
            />
          );
          break;
        case 'Playlists':
          body = <PlaylistsViewer />;
          break;
        case 'Queue':
          body = <Queue />;
          break;
        case 'Settings':
          body = <Settings />;
          break;
        default:
          body = (
            <WithKeyboardInput
              component={albumList}
              tempSearch={tempSearch}
              setTempSearch={setTempSearch}
              debouncedSearch={debouncedSearch}
            />
          );
      }
    }
  }

  if (settings) {
    return (
      <SettingsContext.Provider value={settings}>
        <JukeboxHeader
          search={search}
          setSearch={setSearch}
          setTempSearch={setTempSearch}
          mode={mode}
          setMode={setMode}
          setCategory={setCategory}
          currentAlbum={currentAlbum}
          setCurrentAlbum={setCurrentAlbum}
        />
        <Container
          fluid
          style={{
            background: settings.styles.backgroundColor,
            paddingTop: '5px',
            marginTop: '0px',
            marginLeft: '0px',
            height: getHeight() - 60,
          }}
        >
          {body}
        </Container>
        <JukeboxFooter
          search={search}
          setSearch={setSearch}
          nowPlaying={nowPlaying}
        />
        <ToastContainer />
      </SettingsContext.Provider>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
