import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import styles from './styles';

function Queue() {
  const [tracks, setTracks] = useState([]);

  const loadQueue = () => {
    QueueClient.getQueue().then((data) => {
      setTracks(data);
    });
  };

  if (!tracks.length) {
    loadQueue();
  }

  const message = 'There are no tracks in the queue.';
  const content = (<Alert variant="info">{message}</Alert>);

  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.play();
  };

  const remove = (track) => {
    QueueClient.removeTracksFromQueue([track]);
    loadQueue();
  };

  const renderTracks = [];
  tracks.forEach((track) => {
    renderTracks.push(
      (
        <ListGroupItem style={styles.cardStyle}>
          {track.name}
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
            onClick={() => playNow(track)}
          >
            Play
          </Button>
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
            onClick={() => remove(track)}
          >
            Delete
          </Button>
        </ListGroupItem>
      ),
    );
  });

  if (renderTracks.length) {
    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <ListGroup>
              {renderTracks}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
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
