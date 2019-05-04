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
import defaultCover from '../default_album.jpg';
import TrackList from './TrackList';

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

export class AlbumDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };
    LibrianClient.getCoverArt(props.album.path).then((image) => {
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

    LibrianClient.getAlbumTracks(props.album.path).then((tracks) => {
      const that = this;
      that.setState({
        tracks,
      });
      that.forceUpdate();
    });

    this.pageSize = 100;
    this.currentPage = 1;
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
    const { coverArt, tracks } = this.state;
    return (
      <Container>
        <Row>
          <Col lg={4} xl={4}>
            <Card style={cardStyle} className="h-55 w-85">
              <Card.Img top src={coverArt} />
              <Card.Body>
                <Card.Title style={{ maxHeight: '25px', fontSize: '15px' }}>{album.name}</Card.Title>
              </Card.Body>
            </Card>
            <Button block variant="outline-light">Play Album</Button>
            <Button block variant="outline-light">Enqueue Album</Button>
            <Button block variant="outline-light">Add Album to Playlist</Button>
          </Col>
          <Col lg={8} xl={8}>
            <TrackList tracks={tracks} />
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    return this.largeAlbum();
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetail);
