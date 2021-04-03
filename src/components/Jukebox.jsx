import React, { useState, useCallback } from 'react';
import {
  Container
} from 'react-bootstrap';
import { debounce } from 'lodash';

import AlbumList from './AlbumList';
import NewReleases from './NewReleases';
import SpotifyAlbums from './SpotifyAlbums';
import Categories from './Categories';
import Playlists from './Playlists';
import AlbumDetail from './AlbumDetail';
import '../App.css';
import Queue from './Queue';
import Tracks from './Tracks';
import Settings from './settings/Settings';
import SpotifyClient from '../lib/spotify-client';
import SettingsClient from '../lib/settings-client';
import StatusClient from '../lib/status-client';
import Libraries from './Libraries';
import JukeboxFooter from './JukeboxFooter';
import JukeboxHeader from './JukeboxHeader';
import WithKeyboardInput from './WithKeyboardInput';
import { getHeight, getWidth, calculatePages, pageRows, trackPageRows } from '../lib/pageHelper';

import './Jukebox.css';

function Jukebox() {
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [tempSearch, setTempSearch] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const [nowPlaying, setNowPlaying] = useState('');
  const [pageSize, setPageSize] = useState((Math.floor(getWidth() / 250) * pageRows()));
  const [trackPageSize, setTrackPageSize] = useState((Math.floor(getWidth() / 500) * trackPageRows()));
  const [page, setPage] = useState({ start: 0, limit: pageSize - 1 });
  const [trackPage, setTrackPage] = useState({ start: 0, limit: trackPageSize - 1 });
  const [totalAlbums, setTotalAlbums] = useState();
  const [totalTracks, setTotalTracks] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const resetPage = () => setPage({ start: 0, limit: pageSize - 1 });
  let pages = [];

  const debouncedSearch = useCallback(
    debounce((tempSearch) => {
      if (tempSearch.length > 2) {
        setSearch(tempSearch);
        setTempSearch('');
        window.scrollTo(0, 0);
      }
    }, 500), []);

  if (!isIntervalSet) {
    setIsIntervalSet(true);
    setInterval(() => {
      StatusClient.getStatus().then((data) => {
        if (data.nowPlaying && data.nowPlaying.name) {
          setNowPlaying(data.nowPlaying.name);
          setTotalAlbums(data.totalAlbums);
          setTotalTracks(data.totalTracks);
        } else {
          setNowPlaying('');
          setTotalAlbums(data.totalAlbums);
          setTotalTracks(data.totalTracks);
        }
      });
    }, 3000);
  }

  if (!settings) {
    SettingsClient.getSettings().then((data) => {
      setSettings(data);

      if (data.spotify.useSpotify) {
        SpotifyClient.getAuthorizationToken(`http://${window.location.hostname}:3000`);
      }
    });
  }

  let body = <React.Fragment />;

  const albumList = (
    <AlbumList
      pages={calculatePages(totalAlbums, pageSize)}
      currentPage={currentPage}
      totalAlbums={totalAlbums}
      pageSize={pageSize}
      page={page}
      initialPage={page}
      setPage={setPage}
      search={search}
      setCurrentAlbum={setCurrentAlbum}
      settings={settings}
    />
  );

  const trackList = (
    <Tracks pages={calculatePages(totalTracks, trackPageSize)}
      page={trackPage}
      setTrackPage={setTrackPage}
      search={search}
      settings={settings}
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
          settings={settings}
        />
      );
    } else {
      switch (mode) {
        case 'AlbumList':
          body = <WithKeyboardInput component={albumList} tempSearch={tempSearch} setTempSearch={setTempSearch} debouncedSearch={debouncedSearch} />;
          break;
        case 'NewReleases':
          body = <NewReleases />;
          break;
        case 'Libraries':
          body = (
            <Libraries
              search={search}
              settings={settings}
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
          body = <WithKeyboardInput component={trackList} tempSearch={tempSearch} setTempSearch={setTempSearch} debouncedSearch={debouncedSearch} />;
          break;
        case 'Playlists':
          body = <Playlists settings={settings} />;
          break;
        case 'Queue':
          body = <Queue settings={settings} />;
          break;
        case 'Settings':
          body = <Settings settings={settings} />;
          break;
        default:
          body = albumList;
      }
    }
  }

  if (settings) {
    return (
      <React.Fragment>
        <JukeboxHeader resetPage={resetPage} settings={settings} search={search} setSearch={setSearch} setTempSearch={setTempSearch} mode={mode} setMode={setMode} currentAlbum={currentAlbum} setCurrentAlbum={setCurrentAlbum} />
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
        <JukeboxFooter search={search} setSearch={setSearch} settings={settings} nowPlaying={nowPlaying} />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
