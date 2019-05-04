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
import AlbumList from './AlbumList';
import AlbumDetail from './AlbumDetail';
import rootReducer from '../reducers/index';
import QueueClient from '../lib/queue-client';
import VolumeClient from '../lib/volume-client';
import '../App.css';
import { Queue } from './Queue';
import { Tracks } from './Tracks';
import { Settings } from './Settings';

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

  setNavAlbumList() {
    store.dispatch(actions.setMode('AlbumList'));
    store.dispatch(actions.setCurrentAlbum(''));
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
          body = '';
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
              <Nav.Link onClick={() => { this.setNavAlbumList(); }}>Albums</Nav.Link>
              <Nav.Link onClick={() => { store.dispatch(actions.setMode('Tracks')); }}>Tracks</Nav.Link>
              <Nav.Link onClick={() => { store.dispatch(actions.setMode('Playlists')); }}>Playlists</Nav.Link>
              <Nav.Link onClick={() => { store.dispatch(actions.setMode('Queue')); }}>Queue</Nav.Link>
              <Nav.Link onClick={() => { store.dispatch(actions.setMode('Settings')); }}>Settings</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
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
              <Button style={{ margin: '5px' }} variant="outline-light">Play</Button>
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
