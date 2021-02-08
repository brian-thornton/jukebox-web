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
import { Settings } from './shapes';
import { controlButtonProps } from '../lib/styleHelper';

const propTypes = {
  settings: Settings.isRequired,
};

function Queue({ settings }) {
  const [tracks, setTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const renderTracks = [];

  const loadQueue = () => {
    QueueClient.getQueue().then((data) => {
      setTracks(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  };

  if (!isIntervalSet) {
    setIsIntervalSet(true);
    setInterval(() => {
      loadQueue();
    }, 3000);
  }

  const clear = () => QueueClient.clearQueue().then(loadQueue());
  const content = () => (<ListGroup>{renderTracks}</ListGroup>);
  const message = 'There are no tracks in the queue.';
  const alert = (<Alert variant="primary">{message}</Alert>);

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

  const playNow = (track) => {
    QueueClient.enqueueTop(track);
    QueueClient.play();
  };

  const remove = (track) => {
    QueueClient.removeTracksFromQueue([track]);
    loadQueue();
  };

  const buttonProps = {
    style: { ...styles.buttonStyle, background: settings.styles.buttonBackgroundColor },
    variant: 'outline-light',
    className: 'float-right',
  };

  tracks.forEach((track) => {
    renderTracks.push(
      (
        <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor}}>
          {track.name}
          <Button {...buttonProps} onClick={() => playNow(track)}>Play</Button>
          <Button {...buttonProps} onClick={() => remove(track)}>Delete</Button>
        </ListGroupItem>
      ),
    );
  });

  const controls = () => (
    <React.Fragment>
      <Button {...controlButtonProps(settings)} onClick={clear}>Clear Queue</Button>
      <Button {...controlButtonProps(settings)} onClick={() => shuffle()}>Shuffle Queue</Button>
      <Button {...controlButtonProps(settings)} onClick={() => setAddToPlaylist(true)}>Save to Playlist</Button>
    </React.Fragment>
  );

  if (renderTracks.length) {
    if (!addToPlaylist) {
      return <ContentWithControls alertText="These queued tracks are up next!" controls={controls()} content={content()} />;
    }
    return (<Playlists mode="addToPlaylist" tracks={tracks} settings={settings} />);
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

Queue.propTypes = propTypes;

export default Queue;
