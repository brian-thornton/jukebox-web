import React from 'react';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import QueueClient from '../lib/queue-client';

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
    setMode: mode => {
      dispatch(actions.setMode(mode));
    },
  };
};

export class TrackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  playNow(track) {
    QueueClient.enqueueTop(track.path);
    QueueClient.play();
  }

  enqueue(track) {
    QueueClient.enqueue(track.path);
  }

  render() {
    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
    };

    const renderTracks = [];
    const { tracks } = this.props;
    tracks.forEach((track) => {
      renderTracks.push(
        (
          <ListGroupItem style={cardStyle}>
            {track.name}
            <Button
              variant="outline-light"
              className="float-right"
              onClick={() => this.playNow(track)}>
              Play
            </Button>
            <Button
              variant="outline-light"
              className="float-right"
              onClick={() => this.enqueue(track)}>
              Enqueue
            </Button>
          </ListGroupItem>
        ),
      );
    });

    return (
      <ListGroup>
        {renderTracks}
      </ListGroup>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
