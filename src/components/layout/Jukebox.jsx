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
  const [pagingButtons, setPagingButtons] = useState();
  const [selectedLibraries, setSelectedLibraries] = useState([]);

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
    }, 1000), [],
  );

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

  let body = <React.Fragment />;

  const albumList = (
    <AlbumList
      search={search}
      setCurrentAlbum={setCurrentAlbum}
      category={category}
      setPagingButtons={setPagingButtons}
      selectedLibraries={selectedLibraries}
    />
  );

  const trackList = (
    <Tracks
      search={search}
      setCurrentAlbum={setCurrentAlbum}
    />
  );

  const wrapWithKeyboard = (component) => (
    <WithKeyboardInput
      component={component}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      debouncedSearch={debouncedSearch}
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
          body = wrapWithKeyboard(albumList);
          break;
        case 'Tracks':
          body = wrapWithKeyboard(trackList);
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
          body = wrapWithKeyboard(albumList);
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
          setSelectedLibraries={setSelectedLibraries}
          selectedLibraries={selectedLibraries}
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
          pagingButtons={pagingButtons}
        />
        <ToastContainer />
      </SettingsContext.Provider>
    );
  }

  return <></>;
}

export default Jukebox;
