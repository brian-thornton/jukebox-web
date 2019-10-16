import React from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Container, Row,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PlaylistClient from '../lib/playlist-client';
import PlaylistDetail from './PlaylistDetail';
import styles from './styles';

const actions = require('../actions/index');

const mapStateToProps = function (state) {
  return {
    currentPlaylist: state.currentPlaylist,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    setCurrentPlaylist: playlist => (
      dispatch(actions.setCurrentPlaylist(playlist))
    ),
    setMode: (mode) => {
      dispatch(actions.setMode(mode));
    },
  };
};

export class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
    PlaylistClient.getPlaylists().then((playlists) => {
      const that = this;

      that.setState({
        playlists,
      });
      that.forceUpdate();
    });

    this.addTracksToPlaylist = this.addTracksToPlaylist.bind(this);
  }

  addTracksToPlaylist(name) {
    const { tracks, setCurrentPlaylist } = this.props;
    PlaylistClient.addTracksToPlaylist(name, tracks);
    setCurrentPlaylist(name);
    this.setState({ name });
  }

  buttons(name) {
    const { mode } = this.props;

    const buttons = [];
    if (mode === 'addToPlaylist') {
      buttons.push((<Button
        style={styles.buttonStyle}
        variant="outline-light"
        className="float-right"
        onClick={() => this.addTracksToPlaylist(name)}
      >
        Add
      </Button>));
    } else {
      buttons.push(<Button
        style={styles.buttonStyle}
        variant="outline-light"
        className="float-right"
      >
        Delete
      </Button>);
    }

    return buttons;
  }

  selectPlaylist(name) {
    this.setState({ name });
  }

  render() {
    const { playlists } = this.state;
    const { currentPlaylist } = this.props;
    const renderPlaylists = [];

    playlists.forEach((playlist) => {
      renderPlaylists.push(
        (
          <ListGroupItem style={{ verticalAlign: 'middle' }} onClick={() => this.selectPlaylist(playlist.name)} style={styles.cardStyle} key={playlist.name}>
            {playlist.name}
            {this.buttons(playlist.name)}
          </ListGroupItem>
        ),
      );
    });


    if (!currentPlaylist && !this.state.name) {
      return (
        <Container>
          <Row>
            <Col lg={12} xl={12}>
              <ListGroup>
                {renderPlaylists}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12} xl={12}>
              <Button block variant="outline-info" onClick={this.loadMore}>Load More</Button>
            </Col>
          </Row>
        </Container>
      );
    }
    return (
      <PlaylistDetail name={this.state.name} />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
