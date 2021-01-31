import React, { useState, useCallback } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {
  Container
} from 'react-bootstrap';
import { cloneDeep, debounce } from 'lodash';

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
import SearchModal from './SearchModal';
import Libraries from './Libraries';
import JukeboxFooter from './JukeboxFooter';
import JukeboxHeader from './JukeboxHeader';
import { getHeight, getWidth, calculatePages, pageRows } from '../lib/pageHelper';

import './Jukebox.css';

function Jukebox() {
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const [nowPlaying, setNowPlaying] = useState('');
  const [pageSize, setPageSize] = useState((Math.floor(getWidth() / 250) * pageRows()));
  const [page, setPage] = useState({ start: 0, limit: pageSize - 1 });
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  let pages = [];

  const debouncedSearch = useCallback(
    debounce((tempSearch) => {
      if (tempSearch.length > 3) {
        if (search) {
          setSearch(`${search}${tempSearch}`);
        } else {
          setSearch(tempSearch);
        }
      }
    }, 500), []);

  setInterval(() => {
    StatusClient.getStatus().then((data) => {
      if (data.nowPlaying && data.nowPlaying.name) {
        setNowPlaying(data.nowPlaying.name);
        setTotalAlbums(data.totalAlbums);
      } else {
        setNowPlaying('');
        setTotalAlbums(data.totalAlbums);
      }
    });
  }, 3000);

  if (!settings) {
    SettingsClient.getSettings().then((data) => {
      setSettings(data);

      if (data.spotify.useSpotify) {
        SpotifyClient.getAuthorizationToken(`http://${window.location.hostname}:3000`);
      }
    });
  }

  const handleSearch = (searchText) => {
    setIsSearchModalOpen(false);
    setSearch(searchText);
  };

  let body = <React.Fragment />;
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
          body = (
            <React.Fragment>
              <KeyboardEventHandler
                handleKeys={['all']}
                onKeyEvent={(key) => {
                  let newSearch = cloneDeep(tempSearch);
                  if (key === 'space') {
                    newSearch = `${tempSearch} `;
                    setTempSearch(`${tempSearch} `);
                  } else if (key === 'backspace') {
                    newSearch = `${tempSearch.substring(0, tempSearch.length - 1)}`;
                    setTempSearch(`${tempSearch.substring(0, tempSearch.length - 1)}`);
                  } else {
                    newSearch = `${tempSearch}${key}`;
                    setTempSearch(`${tempSearch}${key}`);
                  }

                  debouncedSearch(newSearch);
                }}
              />
              <AlbumList
                pages={calculatePages(totalAlbums, pageSize)}
                currentPage={currentPage}
                totalAlbums={totalAlbums}
                pageSize={pageSize}
                page={page}
                setPage={setPage}
                search={search}
                setCurrentAlbum={setCurrentAlbum}
                settings={settings}
              />
            </React.Fragment>
          );
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
          body = <Tracks search={search} settings={settings} setCurrentAlbum={setCurrentAlbum} />;
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
          body = (
            <AlbumList
              pages={calculatePages(totalAlbums)}
              currentPage={currentPage}
              totalAlbums={totalAlbums}
              pageSize={pageSize}
              initialPage={page}
              setPage={setPage}
              search={search}
              setCurrentAlbum={setCurrentAlbum}
              settings={settings}
            />
          );
      }
    }
  }

  if (settings) {
    return (
      <React.Fragment>
        <JukeboxHeader settings={settings} search={search} setSearch={setSearch} mode={mode} setMode={setMode} currentAlbum={currentAlbum} setCurrentAlbum={setCurrentAlbum} />
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
        <SearchModal
          isOpen={isSearchModalOpen}
          handleClose={handleSearch}
          search={search}
          settings={settings}
        />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
