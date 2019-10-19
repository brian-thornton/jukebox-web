import React from 'react';
import {
  ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';

export default class PlaylistDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    PlaylistClient.getPlaylist(props.name).then((playlist) => {
      const that = this;
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
