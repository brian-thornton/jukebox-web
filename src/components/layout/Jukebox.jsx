import React, { useState, useCallback, createContext } from 'react';
import { Container } from 'react-bootstrap';
import { debounce } from 'lodash';

import AlbumList from '../albums/AlbumList';
import NewReleases from '../external/NewReleases';
import SpotifyAlbums from '../external/SpotifyAlbums';
import Categories from '../external/Categories';
import Playlists from '../playlists/Playlists';
import AlbumDetail from '../albums/AlbumDetail';
import Queue from '../Queue';
import Tracks from '../Tracks';
import Settings from '../settings/Settings';
import SpotifyClient from '../../lib/spotify-client';
import { getSettings } from '../../lib/settings-client';
import { getStatus } from '../../lib/status-client';
import Libraries from '../Libraries';
import JukeboxFooter from './JukeboxFooter';
import JukeboxHeader from './JukeboxHeader';
import WithKeyboardInput from './WithKeyboardInput';
import { getHeight } from '../../lib/pageHelper';

import './Jukebox.css';

export const SettingsContext = createContext({});

function Jukebox() {
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [tempSearch, setTempSearch] = useState('');
  const [nowPlaying, setNowPlaying] = useState('');
  const [isIntervalSet, setIsIntervalSet] = useState(false);

  const debouncedSearch = useCallback(
    debounce((tempSearch) => {
      if (tempSearch.length > 2) {
        setSearch(tempSearch);
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

      if (data.spotify.useSpotify) {
        SpotifyClient.getAuthorizationToken(`http://${window.location.hostname}:3000`);
      }
    });
  }

  let body = <React.Fragment />;

  const albumList = (
    <AlbumList
      search={search}
      setCurrentAlbum={setCurrentAlbum}
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
        case 'NewReleases':
          body = <NewReleases />;
          break;
        case 'Libraries':
          body = (
            <Libraries
              search={search}
              setCurrentAlbum={setCurrentAlbum}
            />
          );
          break;
        case 'SpotifyAlbums':
          body = <SpotifyAlbums search={search} />;
          break;
        case 'Categories':
          body = <Categories />;
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
          body = <Playlists />;
          break;
        case 'Queue':
          body = <Queue />;
          break;
        case 'Settings':
          body = <Settings />;
          break;
        default:
          body = albumList;
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
      </SettingsContext.Provider>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
