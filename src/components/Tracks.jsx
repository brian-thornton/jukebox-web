import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import TrackList from './TrackList';

export default class Tracks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      limit: 100,
      tracks: [],
    };
    this.loadTracks();
    this.loadTracks = this.loadTracks.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  loadTracks() {
    const { start, limit } = this.state;
    LibrianClient.getTracks(start, limit).then((data) => {
      const that = this;
      const { tracks } = this.state;
      that.setState({
        tracks: tracks.concat(data),
      });
      that.forceUpdate();
    });
  }

  loadMore() {
    const { limit } = this.state;
    this.setState({
      start: limit,
      limit: limit + 100,
    });
    this.loadTracks();
  }

  render() {
    const { tracks } = this.state;

    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <TrackList tracks={tracks} />
            <Button block variant="outline-info" onClick={this.loadMore}>Load More</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
