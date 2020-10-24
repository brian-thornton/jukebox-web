import React, { useState } from 'react';
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
import Settings from './Settings';
import SpotifyClient from '../lib/spotify-client';
import SettingsClient from '../lib/settings-client';
import StatusClient from '../lib/status-client';
import SearchModal from './SearchModal';
import Libraries from './Libraries';

import './Jukebox.css';

import './Jukebox.css';

function Jukebox() {
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();
  const [nowPlaying, setNowPlaying] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
      navLinks = addNavLink(navLinks, features.albums, 'Libraries', 'Libraries');

      if (settings.spotify.useSpotify) {
        navLinks = addNavLink(navLinks, spotifyFeatures.albums, 'SpotifyAlbums', 'Spotify Albums');
        navLinks = addNavLink(navLinks, spotifyFeatures.newReleases, 'NewReleases', 'New Releases');
        navLinks = addNavLink(navLinks, spotifyFeatures.categories, 'Categories', 'Categories');
      }

      navLinks = addNavLink(navLinks, features.tracks, 'Tracks', 'Tracks');
      navLinks = addNavLink(navLinks, features.playlists, 'Playlists', 'Playlists');
      navLinks = addNavLink(navLinks, features.queue, 'Queue', 'Queue');
      navLinks = addNavLink(navLinks, features.settings, 'Settings', 'Settings');
    }
    return navLinks;
  };

  const handleSearch = (searchText) => {
    setIsSearchModalOpen(false);
    setSearch(searchText);
  };

  const addControlButton = (buttons, feature, name, handler) => {
    if (feature) {
      buttons.push(<Button key={name} style={{ margin: '5px' }} variant="outline-light" onClick={handler}>{name}</Button>);
    }

    return buttons;
  };

  const generateControlButtons = () => {
    let buttons = [];
    if (settings) {
      const { features } = settings;

      buttons = addControlButton(buttons, features.play, 'Play', QueueClient.next);
      buttons = addControlButton(buttons, features.next, 'Next', QueueClient.next);
      buttons = addControlButton(buttons, features.stop, 'Stop', QueueClient.stop);
      buttons = addControlButton(buttons, features.volume, 'Volume Up', VolumeClient.up);
      buttons = addControlButton(buttons, features.volume, 'Volume Down', VolumeClient.down);
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
            <AlbumList
              search={search}
              setCurrentAlbum={setCurrentAlbum}
              settings={settings}
            />
          );
          break;
        case 'NewReleases':
          body = <NewReleases />;
          break;
          case 'Libraries':
            body = <Libraries search={search} settings={settings} setCurrentAlbum={setCurrentAlbum}/>;
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
    if (search) {
      return (
        <div className="search-result">
          {`Search Results: ${search}`}
        </div>
      );
    }

    return <React.Fragment />;
  };

  if (settings) {
    return (
      <React.Fragment>
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">{settings.preferences.name}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {generateNavItems()}
            </Nav>
            {searchResults()}
            <Button style={{ margin: '5px' }} variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid style={{ marginTop: '50px', marginBottom: '60px', marginLeft: '60px' }} className="mx-0 px-0">
          {body}
        </Container>
        <Navbar fixed="bottom" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="now-playing">
              {`Now Playing: ${nowPlaying}`}
            </div>
            <Nav className="ml-auto">
              {generateControlButtons()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <SearchModal isOpen={isSearchModalOpen} handleClose={handleSearch} />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default Jukebox;
