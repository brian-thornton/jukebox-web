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
import Playlists from './Playlists';
import AlbumDetail from './AlbumDetail';
import rootReducer from '../reducers/index';
import QueueClient from '../lib/queue-client';
import VolumeClient from '../lib/volume-client';
import '../App.css';
import Queue from './Queue';
import Tracks from './Tracks';
import Settings from './Settings';

const actions = require('../actions/index');

const store = createStore(rootReducer);

export default class Jukebox extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(actions.setMode('AlbumList'));
  }

  componentDidMount() {
    store.subscribe(this.forceUpdate.bind(this));
  }

  onSearch() {
    const search = document.getElementById('searchBox').value;
    store.dispatch(actions.setSearch(search));
  }

  setNav(mode) {
    store.dispatch(actions.setMode(mode));
    store.dispatch(actions.setCurrentAlbum(''));
  }

  debounce(fn, time) {
    let timeout;

    return function () {
      const functionCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  }

  render() {
    let body = '';
    if (store.getState().currentAlbum) {
      body = <AlbumDetail album={store.getState().currentAlbum} />;
    } else {
      switch (store.getState().mode) {
        case 'AlbumList':
          body = <AlbumList />;
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
          body = <AlbumList />;
      }
    }

    return (
      <Provider store={store}>
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Jukebox</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => { this.setNav('AlbumList'); }}>Albums</Nav.Link>
              <Nav.Link onClick={() => { this.setNav('Tracks'); }}>Tracks</Nav.Link>
              <Nav.Link onClick={() => { this.setNav('Playlists'); }}>Playlists</Nav.Link>
              <Nav.Link onClick={() => { this.setNav('Queue'); }}>Queue</Nav.Link>
              <Nav.Link onClick={() => { this.setNav('Settings'); }}>Settings</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl id="searchBox" type="text" onChange={this.debounce(this.onSearch, 500)} placeholder="Search" className="mr-sm-2" />
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
              <Button style={{ margin: '5px' }} variant="outline-light" onClick={QueueClient.next}>Play</Button>
              <Button style={{ margin: '5px' }} variant="outline-light" onClick={QueueClient.next}>Next</Button>
              <Button style={{ margin: '5px' }} variant="outline-light" onClick={QueueClient.stop}>Stop</Button>
              <Button style={{ margin: '5px' }} variant="outline-light" onClick={VolumeClient.up}>Volume Up</Button>
              <Button style={{ margin: '5px' }} variant="outline-light" className="float-right" onClick={VolumeClient.down}>Volume Down</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Provider>
    );
  }
}
