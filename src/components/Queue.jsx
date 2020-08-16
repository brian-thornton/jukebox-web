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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadQueue = () => {
    QueueClient.getQueue().then((data) => {
      setTracks(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  };

  if (!isLoading && !isLoaded && !tracks.length) {
    setIsLoading(true);
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
  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  tracks.forEach((track) => {
    renderTracks.push(
      (
        <ListGroupItem style={styles.cardStyle}>
          {track.name}
          <Button {...buttonProps} onClick={() => playNow(track)}>
            Play
          </Button>
          <Button {...buttonProps} onClick={() => remove(track)}>
            Delete
          </Button>
        </ListGroupItem>
      ),
    );
  });

  const settingsProps = {
    style: styles.settingsButtonStyle,
    variant: 'outline-light',
  };

  const clear = () => QueueClient.clearQueue().then(loadQueue());

  if (renderTracks.length) {
    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <Alert variant="primary">These queued tracks are up next!</Alert>
          </Col>
        </Row>
        <Row>
          <Col lg={2} xl={2}>
            <Button {...settingsProps} onClick={clear}>Clear Queue</Button>
            <Button {...settingsProps}>Shuffle Queue</Button>
            <Button {...settingsProps}>Save to Playlist</Button>
          </Col>
          <Col lg={10} xl={10}>
            <ListGroup>{renderTracks}</ListGroup>
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
