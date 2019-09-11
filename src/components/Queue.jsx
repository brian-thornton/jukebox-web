import React from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import { TrackList } from './TrackList';

export class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };
    QueueClient.getQueue().then((tracks) => {
      const that = this;

      that.setState({
        tracks,
      });
      that.forceUpdate();
    });
  }

  render() {
    const { tracks } = this.state;
    const message = 'There are no tracks in the queue.';
    let content = (<Alert variant="info">{message}</Alert>);

    if (tracks.length) {
      content = (<TrackList tracks={tracks} />);
    }

    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            {content}
          </Col>
        </Row>
      </Container>
    );
  }
}
