import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  Row,
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { AlbumList } from './AlbumList';
import NewReleases from './NewReleases';
import SpotifyAlbums from './SpotifyAlbums';
import Categories from './Categories';
import Playlists from './Playlists';
import AlbumDetail from './AlbumDetail';
import rootReducer from '../reducers/index';
import QueueClient from '../lib/queue-client';
import VolumeClient from '../lib/volume-client';
import '../App.css';
import Queue from './Queue';
import Tracks from './Tracks';
import Settings from './Settings';
import SpotifyClient from '../lib/spotify-client';
import SettingsClient from '../lib/settings-client';

const actions = require('../actions/index');

const store = createStore(rootReducer);

export default class Jukebox extends React.Component {
  static setNav(mode) {
    store.dispatch(actions.setMode(mode));
    store.dispatch(actions.setCurrentAlbum(''));
  }

  static debounce(fn, time) {
    let timeout;

    return () => {
      const functionCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  }

  constructor(props) {
    super(props);
    store.dispatch(actions.setMode('AlbumList'));
    this.state = {
      navLinks: [],
      controlButtons: []
    };
    this.onSearch = this.onSearch.bind(this);
    SettingsClient.getSettings().then((settings) => {
      this.setState(
        {
          settings,
        },
      );

      if (settings.spotify.useSpotify) {
        SpotifyClient.getAuthorizationToken(`http://${window.location.hostname}:3000`);
      }
    });
  }

  componentDidMount() {
    store.subscribe(this.forceUpdate.bind(this));
  }

  onSearch() {
    this.setState({ search: document.getElementById('searchBox').value });
  }

  addNavLink(navLinks, feature, navKey, navName) {
    if (feature) {
      navLinks.push(<Nav.Link key={navName} onClick={() => { Jukebox.setNav(navKey); }}>{navName}</Nav.Link>);
    }
    return navLinks;
  }

  generateNavItems() {
    let navLinks = [];

    if (this.state.settings) {
      const { spotify, features } = this.state.settings;
      const { spotifyFeatures } = spotify;

      navLinks = this.addNavLink(navLinks, features.albums, 'AlbumList', 'Albums');
      navLinks = this.addNavLink(navLinks, spotifyFeatures.albums, 'SpotifyAlbums', 'Spotify Albums');
      navLinks = this.addNavLink(navLinks, spotifyFeatures.newReleases, 'NewReleases', 'New Releases');
      navLinks = this.addNavLink(navLinks, spotifyFeatures.categories, 'Categories', 'Categories');
      navLinks = this.addNavLink(navLinks, features.tracks, 'Tracks', 'Tracks');
      navLinks = this.addNavLink(navLinks, features.playlists, 'Playlists', 'Playlists');
      navLinks = this.addNavLink(navLinks, features.queue, 'Queue', 'Queue');
      navLinks = this.addNavLink(navLinks, features.settings, 'Settings', 'Settings');
    }
    return navLinks;
  }

  addControlButton(buttons, feature, name, handler) {
    if (feature) {
      buttons.push(<Button key={name} style={{ margin: '5px' }} variant="outline-light" onClick={handler}>{name}</Button>);
    }

    return buttons;
  }

  generateControlButtons() {
    let buttons = [];
    if (this.state.settings) {
      const { features } = this.state.settings;

      buttons = this.addControlButton(buttons, features.play, 'Play', QueueClient.next);
      buttons = this.addControlButton(buttons, features.next, 'Next', QueueClient.next);
      buttons = this.addControlButton(buttons, features.stop, 'Stop', QueueClient.stop);
      buttons = this.addControlButton(buttons, features.volume, 'Volume Up', VolumeClient.up);
      buttons = this.addControlButton(buttons, features.volume, 'Volume Down', VolumeClient.down);
    }
    return buttons;
  }

  render() {
    const { search } = this.state;

    let body = '';
    if (store.getState().currentAlbum) {
      body = <AlbumDetail search={search} album={store.getState().currentAlbum} />;
    } else {
      switch (store.getState().mode) {
        case 'AlbumList':
          body = <AlbumList search={search} />;
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
          body = <Tracks />;
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
          body = <AlbumList search={search} />;
      }
    }

    return (
      <Provider store={store}>
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Jukebox</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {this.generateNavItems()}
            </Nav>
            <Form inline>
              <FormControl id="searchBox" type="text" onChange={Jukebox.debounce(this.onSearch, 500)} placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid style={{ marginTop: '50px', marginBottom: '60px' }} className="mx-0 px-0">
          <Row>
            {body}
          </Row>
        </Container>
        <Navbar fixed="bottom" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              {this.generateControlButtons()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Provider>
    );
  }
}
