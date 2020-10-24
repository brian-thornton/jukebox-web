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
import Playlists from './Playlists';
import QueueClient from '../lib/queue-client';
import styles from './styles';
import ContentWithControls from './ContentWithControls';

function Queue() {
  const [tracks, setTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const renderTracks = [];

  const loadQueue = () => {
    QueueClient.getQueue().then((data) => {
      setTracks(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  };

  const clear = () => QueueClient.clearQueue().then(loadQueue());
  const content = () => (<ListGroup>{renderTracks}</ListGroup>);

  const shuffle = () => {
    QueueClient.clearQueue().then(() => {
      QueueClient.enqueueTracks(tracks.sort(() => Math.random() - 0.5)).then(() => {
        loadQueue();
      });
    });
  };

  if (!isLoading && !isLoaded && !tracks.length) {
    setIsLoading(true);
    loadQueue();
  }

  const message = 'There are no tracks in the queue.';
  const alert = (<Alert variant="primary">{message}</Alert>);

  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.play();
  };

  const remove = (track) => {
    QueueClient.removeTracksFromQueue([track]);
    loadQueue();
  };

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

  const controls = () => (
    <React.Fragment>
      <Button {...settingsProps} onClick={clear}>Clear Queue</Button>
      <Button {...settingsProps} onClick={() => shuffle()}>Shuffle Queue</Button>
      <Button {...settingsProps} onClick={() => setAddToPlaylist(true)}>Save to Playlist</Button>
    </React.Fragment>
  );

  if (renderTracks.length) {
    if (!addToPlaylist) {
      return <ContentWithControls alertText="These queued tracks are up next!" controls={controls()} content={content()} />;
    }
    return (<Playlists mode="addToPlaylist" tracks={tracks} />);
  }
  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          {alert}
        </Col>
      </Row>
    </Container>
  );
}

export default Queue;
