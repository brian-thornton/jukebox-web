import React, { useState, useCallback } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import AlbumList from './AlbumList';
import NewReleases from './NewReleases';
import SpotifyAlbums from './SpotifyAlbums';
import Categories from './Categories';
import Playlists from './Playlists';
import AlbumDetail from './AlbumDetail';
import QueueClient from '../lib/queue-client';
import VolumeClient from '../lib/volume-client';
import '../App.css';
import Queue from './Queue';
import Tracks from './Tracks';
import Settings from './settings/Settings';
import SpotifyClient from '../lib/spotify-client';
import SettingsClient from '../lib/settings-client';
import StatusClient from '../lib/status-client';
import SearchModal from './SearchModal';
import Libraries from './Libraries';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { cloneDeep, debounce } from 'lodash';
import { ChevronDoubleRight, Play, Search, VolumeUp, VolumeDown, XSquare, XOctagonFill } from 'react-bootstrap-icons';

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

  const addNavLink = (navLinks, feature, navKey, navName) => {
    if (feature) {
      navLinks.push(
        <Nav.Link
          key={navName}
          onClick={() => {
            setMode(navKey);
            setCurrentAlbum('');
          }}
        >
          {navName}
        </Nav.Link>,
      );
    }
    return navLinks;
  };

  const generateNavItems = () => {
    let navLinks = [];

    if (settings && settings.features) {
      const { spotify, features } = settings;
      const { spotifyFeatures } = spotify;

      navLinks = addNavLink(navLinks, features.albums, 'AlbumList', 'Albums');
      navLinks = addNavLink(navLinks, features.libraries, 'Libraries', 'Libraries');

      if (settings.spotify.useSpotify) {
        navLinks = addNavLink(navLinks, spotifyFeatures.albums, 'SpotifyAlbums', 'Spotify Albums');
        navLinks = addNavLink(navLinks, spotifyFeatures.newReleases, 'NewReleases', 'New Releases');
        navLinks = addNavLink(navLinks, spotifyFeatures.categories, 'Categories', 'Categories');
      }

      navLinks = addNavLink(navLinks, features.tracks, 'Tracks', 'Tracks');
      navLinks = addNavLink(navLinks, features.playlists, 'Playlists', 'Playlists');
      navLinks = addNavLink(navLinks, features.queue, 'Queue', 'Queue');

      if (!isScreenSmall) {
        navLinks = addNavLink(navLinks, features.settings, 'Settings', 'Settings');
      }
    }
    return navLinks;
  };

  const handleSearch = (searchText) => {
    setIsSearchModalOpen(false);
    setSearch(searchText);
  };

  const addControlButton = (buttons, feature, name, handler) => {
    if (feature) {
      buttons.push(<Button key={name} className="button" variant="outline-light" onClick={handler}>{name}</Button>);
    }

    return buttons;
  };

  const generateControlButtons = () => {
    let buttons = [];
    if (settings) {
      const { features } = settings;

      const props = {
        className: "button",
        variant: "outline-light",
      };

      if (isScreenSmall) {
        buttons.push(<Button {...props} onClick={() => {
          document.activeElement.blur();
          setIsSmallSearchEnabled(true);
        }
        }><Search className="volume-icon" /></Button>);
      }

      if (isScreenSmall) {
        buttons.push(<Button {...props} onClick={QueueClient.next}><Play className="volume-icon" /></Button>);
        buttons.push(<Button {...props} onClick={QueueClient.next}><ChevronDoubleRight className="volume-icon" /></Button>);
        buttons.push(<Button {...props} onClick={QueueClient.stop}><XOctagonFill className="volume-icon" /></Button>);
      } else {
        buttons = addControlButton(buttons, features.play, 'Play', QueueClient.next);
        buttons = addControlButton(buttons, features.next, 'Next', QueueClient.next);
        buttons = addControlButton(buttons, features.stop, 'Stop', QueueClient.stop);
      }

      if (isScreenSmall) {
        buttons.push(<Button {...props} onClick={VolumeClient.up}><VolumeUp className="volume-icon" /></Button>);
        buttons.push(<Button {...props} onClick={VolumeClient.down}><VolumeDown className="volume-icon" /></Button>);
      } else {
        buttons = addControlButton(buttons, features.volume, 'Volume Up', VolumeClient.up);
        buttons = addControlButton(buttons, features.volume, 'Volume Down', VolumeClient.down);
      }
    }
    return buttons;
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
                onKeyEvent={(key, e) => {
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
                }
                } />
              <AlbumList
                search={search}
                setCurrentAlbum={setCurrentAlbum}
                settings={settings}
              />
            </React.Fragment >
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
      return <React.Fragment />
    }

    return <div className="now-playing">{`Now Playing: ${nowPlaying}`}</div>;
  };

  const brand = () => {
    if (isScreenSmall) {
      return <React.Fragment />
    }

    return <Navbar.Brand href="#home">{settings.preferences.name}</Navbar.Brand>;
  };

  const searchButton = () => {
    if (isScreenSmall) {
      return <React.Fragment />
    }

    if (search) {
      return (
        <React.Fragment>
          <Button className="button" variant="outline-light" onClick={() => {
            setSearch('');
            setTempSearch('');
          }}>Clear</Button>;
          <Button className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>;
        </React.Fragment>
      );
    }

    return <Button className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>;
  };

  const footerContent = () => {
    const props = {
      className: "button",
      variant: "outline-light",
    };

    if (isSmallSearchEnabled) {
      return (
        <Nav className="ml-auto">
          <Button {...props} onClick={() => {
            document.activeElement.blur();
            setIsSmallSearchEnabled(false);
          }}><XSquare className="volume-icon" /></Button>]
          <input type="text" onChange={(event) => debouncedSearch(event.target.value)} />
        </Nav>
      );
    } else {
      return <Nav className="ml-auto">{generateControlButtons()}</Nav>;
    }
  };

  if (settings) {
    return (
      <React.Fragment>
        <Navbar fixed="top" collapseOnSelect bg="dark" variant="dark">
          {brand()}
          <Nav className="mr-auto">
            {generateNavItems()}
          </Nav>
          {searchResults()}
          {searchButton()}
        </Navbar>
        <Container fluid style={{ marginTop: '50px', marginBottom: '60px', marginLeft: '60px' }} className="mx-0 px-0">
          {body}
        </Container>
        <Navbar fixed="bottom" collapseOnSelect bg="dark" variant="dark">
          {nowPlayingText()}
          {footerContent()}
        </Navbar>
        <SearchModal isOpen={isSearchModalOpen} handleClose={handleSearch} search={search} />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
