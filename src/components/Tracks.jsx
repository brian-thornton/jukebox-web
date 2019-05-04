import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import TrackList from './TrackList';

export class Tracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };
    LibrianClient.getTracks().then((tracks) => {
      const that = this;

      that.setState({
        tracks,
      });
      that.forceUpdate();
    });
  }

  render() {
    const { tracks } = this.state;

    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <TrackList tracks={tracks} />
          </Col>
        </Row>
      </Container>
    );
  }
}
