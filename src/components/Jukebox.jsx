import React, { useState, useCallback } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {
  Container,
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import { cloneDeep, debounce } from 'lodash';
import { XSquare } from 'react-bootstrap-icons';

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
import ControlButtons from './ControlButtons';
import NavigationButtons from './NavigationButtons';

import './Jukebox.css';

function Jukebox() {
  const getWidth = () => {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  const getHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }

  const pageRows = () => {
    return Math.floor(getHeight() / 300);
  }

  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const [nowPlaying, setNowPlaying] = useState('');
  const [isSmallSearchEnabled, setIsSmallSearchEnabled] = useState(false);
  const [pageSize, setPageSize] = useState((Math.floor(getWidth() / 250) * pageRows()));
  const [page, setPage] = useState({ start: 0, limit: pageSize -1 });
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  let pages = [];

  const calculatePages = (totalAlbums) => {
    const calcPages = [];

    let counter = 1;
    let albumCounter = 0;
    let pageStart = 0;
    while (albumCounter <= totalAlbums) {
      if (counter === pageSize) {
        calcPages.push({ start: pageStart, limit: albumCounter });
        counter = 0;
        pageStart = albumCounter + 1;
      } else {


        counter += 1;
      }
      albumCounter += 1;
    }
    return calcPages;
  }

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
                pages={calculatePages(totalAlbums)}
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

  const searchResults = () => {
    if (search && !isScreenSmall) {
      return (
        <div className="search-result">
          {`Search Results: ${search}`}
        </div>
      );
    }

    return <React.Fragment />;
  };

  const nowPlayingText = () => {
    if (isScreenSmall) {
      return <React.Fragment />;
    }

    return <div className="now-playing">{`Now Playing: ${nowPlaying}`}</div>;
  };

  const brand = () => {
    if (isScreenSmall) {
      return <React.Fragment />;
    }

    return <Navbar.Brand href="#home" style={{ color: settings.styles.fontColor }}>{settings.preferences.name}</Navbar.Brand>;
  };

  const searchButton = () => {
    if (isScreenSmall) {
      return <React.Fragment />;
    }

    if (search) {
      return (
        <React.Fragment>
          <Button
            style={{ background: settings.styles.buttonBackgroundColor, fontWeight: settings.styles.buttonFontWeight, color: settings.styles.buttonFontColor }}
            className="button"
            variant="outline-light"
            onClick={() => {
              setSearch('');
              setTempSearch('');
            }}
          >
            Clear
          </Button>
          <Button style={{ background: settings.styles.buttonBackgroundColor, fontWeight: settings.styles.buttonFontWeight, color: settings.styles.buttonFontColor }} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>
        </React.Fragment>
      );
    }

    return <Button style={{ background: settings.styles.buttonBackgroundColor, fontWeight: settings.styles.buttonFontWeight, color: settings.styles.buttonFontColor }} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>;
  };

  const footerContent = () => {
    const props = {
      className: 'button',
      variant: 'outline-light',
    };

    if (isSmallSearchEnabled) {
      return (
        <Nav className="ml-auto">
          <Button
            {...props}
            onClick={() => {
              document.activeElement.blur();
              setIsSmallSearchEnabled(false);
            }}
          >
            <XSquare className="volume-icon" />
          </Button>
          <input type="text" onChange={event => debouncedSearch(event.target.value)} />
        </Nav>
      );
    }

    return (
      <Nav className="ml-auto">
        <ControlButtons
          settings={settings}
          isScreenSmall={isScreenSmall}
          setIsSmallSearchEnabled={setIsSmallSearchEnabled}
        />
      </Nav>
    );
  };

  if (settings) {
    return (
      <React.Fragment>
        <Navbar fixed="top" collapseOnSelect variant="dark" style={{ background: settings.styles.headerColor }}>
          {brand()}
          <Nav className="mr-auto">
            <NavigationButtons
              settings={settings}
              isScreenSmall={isScreenSmall}
              setMode={setMode}
              setCurrentAlbum={setCurrentAlbum}
            />
          </Nav>
          {searchResults()}
          {searchButton()}
        </Navbar>
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
        <Navbar fixed="bottom" collapseOnSelect style={{ background: settings.styles.footerColor }} variant="dark">
          {nowPlayingText()}
          {footerContent()}
        </Navbar>
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
