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
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [nowPlaying, setNowPlaying] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const [isSmallSearchEnabled, setIsSmallSearchEnabled] = useState(false);

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
    StatusClient.getStatus().then((status) => {
      if (status.nowPlaying) {
        setNowPlaying(status.nowPlaying.name);
      } else {
        setNowPlaying('');
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
            style={{ background: settings.styles.buttonBackgroundColor }}
            className="button"
            variant="outline-light"
            onClick={() => {
              setSearch('');
              setTempSearch('');
            }}
          >
            Clear
          </Button>
          <Button style={{ background: settings.styles.buttonBackgroundColor }} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>
        </React.Fragment>
      );
    }

    return <Button style={{ background: settings.styles.buttonBackgroundColor }} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>;
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
        <Container fluid style={{ background: settings.styles.backgroundColor, marginTop: '50px', height: '4000px', marginBottom: '60px', marginLeft: '60px' }} className="mx-0 px-0">
          {body}
        </Container>
        <Navbar fixed="bottom" collapseOnSelect style={{ background: settings.styles.footerColor }} variant="dark">
          {nowPlayingText()}
          {footerContent()}
        </Navbar>
        <SearchModal isOpen={isSearchModalOpen} handleClose={handleSearch} search={search} settings={settings} />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
