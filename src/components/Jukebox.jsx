import React, { useState } from 'react';
import {
  Row,
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
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

function Jukebox() {
  const [mode, setMode] = useState('AlbumList');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState();
  const [currentAlbum, setCurrentAlbum] = useState();

  if (!settings) {
    SettingsClient.getSettings().then((settings) => {
      setSettings(settings);

      if (settings.spotify.useSpotify) {
        SpotifyClient.getAuthorizationToken(`http://${window.location.hostname}:3000`);
      }
    });
  }

  const generateNavItems = () => {
    let navLinks = [];

    if (settings) {
      const { spotify, features } = settings;
      const { spotifyFeatures } = spotify;

      navLinks = addNavLink(navLinks, features.albums, 'AlbumList', 'Albums');
      navLinks = addNavLink(navLinks, spotifyFeatures.albums, 'SpotifyAlbums', 'Spotify Albums');
      navLinks = addNavLink(navLinks, spotifyFeatures.newReleases, 'NewReleases', 'New Releases');
      navLinks = addNavLink(navLinks, spotifyFeatures.categories, 'Categories', 'Categories');
      navLinks = addNavLink(navLinks, features.tracks, 'Tracks', 'Tracks');
      navLinks = addNavLink(navLinks, features.playlists, 'Playlists', 'Playlists');
      navLinks = addNavLink(navLinks, features.queue, 'Queue', 'Queue');
      navLinks = addNavLink(navLinks, features.settings, 'Settings', 'Settings');
    }
    return navLinks;
  };

  const onSearch = () => {
    // window.stop();
    setSearch(document.getElementById('searchBox').value);
  };

  const addNavLink = (navLinks, feature, navKey, navName) => {
    if (feature) {
      navLinks.push(<Nav.Link key={navName} onClick={() => {
        setMode(navKey);
        setCurrentAlbum('');
      }}>{navName}</Nav.Link>);
    }
    return navLinks;
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

  const debounce = (fn, time) => {
    let timeout;

    return () => {
      const functionCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  }

  let body = '';
  if (currentAlbum) {
    body = <AlbumDetail search={search} album={currentAlbum} />;
  } else {
    switch (mode) {
      case 'AlbumList':
        body = <AlbumList search={search} setCurrentAlbum={setCurrentAlbum} />;
        break;
      case 'NewReleases':
        body = <NewReleases />;
        break;
      case 'SpotifyAlbums':
        body = <SpotifyAlbums search={search} />;
        break;
      case 'Categories':
        body = <Categories />;
        break;
      case 'Tracks':
        body = <Tracks search={search} />;
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
        body = <AlbumList search={search} setCurrentAlbum={setCurrentAlbum} />;
    }
  }

  return (
    <React.Fragment>
      <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Jukebox</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {generateNavItems()}
          </Nav>
          <Form inline>
            <FormControl id="searchBox" type="text" onChange={debounce(onSearch, 1000)} placeholder="Search" className="mr-sm-2" />
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container fluid style={{ marginTop: '50px', marginBottom: '60px', marginLeft: '60px' }} className="mx-0 px-0">
        {body}
      </Container>
      <Navbar fixed="bottom" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            {generateControlButtons()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
}

export default Jukebox;