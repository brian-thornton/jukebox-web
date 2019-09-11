import React from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Container, Row,
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
  }

  render() {
    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
    };

    const buttonStyle = {
      margin: '5px',
    };

    const renderPlaylists = [];
    const { playlists } = this.state;
    playlists.forEach((playlist) => {
      renderPlaylists.push(
        (
          <ListGroupItem style={cardStyle} key={playlist.name}>
            {playlist.name}
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
            >
              Delete
            </Button>
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
