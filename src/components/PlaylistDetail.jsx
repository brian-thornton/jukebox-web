import React from 'react';
import {
  ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';

const actions = require('../actions/index');

const mapStateToProps = function (state) {
  return {
    currentAlbum: state.currentAlbum,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    setCurrentAlbum: album => (
      dispatch(actions.setCurrentAlbum(album))
    ),
    setMode: (mode) => {
      dispatch(actions.setMode(mode));
    },
  };
};

export class PlaylistDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    console.log(props.name);
    PlaylistClient.getPlaylist(props.name).then((playlist) => {
      const that = this;
      console.log(playlist);
      that.setState({
        tracks: playlist.tracks,
      });
      that.forceUpdate();
    });
  }

  playNow(track) {
    QueueClient.enqueueTop(track.path);
    QueueClient.play();
  }

  enqueue(track) {
    QueueClient.enqueue(track);
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

    const renderTracks = [];
    const { tracks } = this.state;
    if (tracks) {
      tracks.forEach((track) => {
        renderTracks.push(
          (
            <ListGroupItem style={cardStyle}>
              {track.name}
              <Button
                style={buttonStyle}
                variant="outline-light"
                className="float-right"
                onClick={() => this.playNow(track)}
              >
                Play
              </Button>
              <Button
                style={buttonStyle}
                variant="outline-light"
                className="float-right"
                onClick={() => this.enqueue(track)}
              >
                Enqueue
              </Button>
            </ListGroupItem>
          ),
        );
      });
    }

    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <ListGroup>
              {renderTracks}
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
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetail);
