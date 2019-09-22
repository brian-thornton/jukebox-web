import React from 'react';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import LibrianClient from '../lib/librarian-client';
import QueueClient from '../lib/queue-client';
import defaultCover from '../default_album.jpg';
import TrackList from './TrackList';
import Playlists from './Playlists';

const actions = require('../actions/index');

const mapStateToProps = function (state) {
  return {
    currentAlbum: state.currentAlbum
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

class AlbumDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };

    this.loadCoverArt = this.loadCoverArt.bind(this);
    this.loadTracks = this.loadTracks.bind(this);
    this.enqueueAlbum = this.enqueueAlbum.bind(this);
    this.playAlbum = this.playAlbum.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.loadCoverArt();
    this.loadTracks();
  }

  loadCoverArt() {
    const { album } = this.props;
    LibrianClient.getCoverArt(album.path).then((image) => {
      const that = this;
      let src;

      if (image.type === 'image/jpeg') {
        src = URL.createObjectURL(image);
      } else {
        src = defaultCover;
      }

      that.setState({
        coverArt: src,
      });
      that.forceUpdate();
    });
  }

  loadTracks() {
    const { album } = this.props;
    LibrianClient.getAlbumTracks(album.path).then((tracks) => {
      const that = this;
      that.setState({
        tracks,
      });
      that.forceUpdate();
    });
  }

  enqueueAlbum() {
    const { tracks } = this.state;
    QueueClient.enqueueTracks(tracks);
  }

  playAlbum() {
    const { tracks } = this.state;
    QueueClient.enqueueTracksTop(tracks);
  }

  addToPlaylist() {
    this.setState({
      addToPlaylist: true
    })
  }

  largeAlbum() {
    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
      maxWidth: '400px',
      margin: '10px',
    };

    const { album } = this.props;
    const { coverArt, tracks, addToPlaylist } = this.state;

    if (!addToPlaylist) {
      return (
        <Container>
          <Row>
            <Col lg={4} xl={4}>
              <Card style={cardStyle} className="h-55 w-85">
                <Card.Img top src={coverArt} />
                <Card.Body>
                  <Card.Title style={{ maxHeight: '25px', fontSize: '15px' }}>{album.name}</Card.Title>
                </Card.Body>
                <Button block variant="outline-light" onClick={this.playAlbum}>Play Album</Button>
                <Button block variant="outline-light" onClick={this.enqueueAlbum}>Enqueue Album</Button>
                <Button block variant="outline-light" onClick={this.addToPlaylist}>Add Album to Playlist</Button>
              </Card>
            </Col>
            <Col lg={8} xl={8}>
              <TrackList tracks={tracks} />
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Playlists mode="addToPlaylist" tracks={tracks}/>
      )
    }
  }

  render() {
    return this.largeAlbum();
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetail);
