import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import TrackList from './TrackList';

function Queue() {
  const [tracks, setTracks] = useState([]);

  QueueClient.getQueue().then((data) => {
    setTracks(data);
  });

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

export default Queue;
