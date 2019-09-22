import React from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Container, Row, Alert
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PlaylistClient from '../lib/playlist-client';

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
    const { tracks } = this.props;
    PlaylistClient.addTracksToPlaylist(name, tracks);
  }

  buttons(name) {
    const { mode } = this.props;

    const buttonStyle = {
      margin: '5px',
    };

    const buttons = [];
    if (mode === 'addToPlaylist') {
      buttons.push((<Button
        style={buttonStyle}
        variant="outline-light"
        className="float-right"
        onClick={() => this.addTracksToPlaylist(name)}
      >
        Add
      </Button>))
    } else {
      buttons.push(<Button
        style={buttonStyle}
        variant="outline-light"
        className="float-right"
      >
        Delete
    </Button>)
    }

    return buttons;
  }

  render() {
    const { playlists } = this.state;

    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
    };

    const renderPlaylists = [];

    playlists.forEach((playlist) => {
      renderPlaylists.push(
        (
          <ListGroupItem style={{ verticalAlign: 'middle' }} style={cardStyle} key={playlist.name}>
            {playlist.name}
            {this.buttons(playlist.name)}
          </ListGroupItem>
        ),
      );
    });

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
}
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
