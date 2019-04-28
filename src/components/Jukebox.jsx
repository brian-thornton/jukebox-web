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
import '../App.css';

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
          body = '';
          break;
        case 'Playlists':
          body = '';
          break;
        case 'Queue':
          body = '';
          break;
        case 'Settings':
          body = '';
          break;
        default:
          body = <AlbumList />;
      }
    }

    return (
      <Provider store={store}>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Jukebox</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home" onClick={() => { this.setNavAlbumList(); }}>Albums</Nav.Link>
              <Nav.Link href="#features" onClick={() => { store.dispatch(actions.setMode('Tracks')); }}>Tracks</Nav.Link>
              <Nav.Link href="#pricing" onClick={() => { store.dispatch(actions.setMode('Playlists')); }}>Playlists</Nav.Link>
              <Nav.Link href="#pricing" onClick={() => { store.dispatch(actions.setMode('Queue')); }}>Queue</Nav.Link>
              <Nav.Link href="#pricing" onClick={() => { store.dispatch(actions.setMode('Settings')); }}>Settings</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid className="mx-0 px-0">
          <Row>
            {body}
          </Row>
        </Container>
      </Provider>
    );
  }
}
