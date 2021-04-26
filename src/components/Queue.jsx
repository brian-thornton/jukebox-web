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
import PlayNowButton from './PlayNowButton';
import PagingButtons from './PagingButtons';
import { findPage } from '../lib/pageHelper';

const propTypes = {
  settings: Settings.isRequired,
};

function Queue({ settings, setPage, pages, page }) {
  const [tracks, setTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
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
  
  const queueMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', height: '100%' };
  };

  const loadMore = () => setPage(pages[findPage(pages, page) + 1]);
  const loadPrevious = () => setPage(pages[findPage(pages, page) - 1]);

  
  const content = () => {
    return (
      <Container id="albums" fluid style={queueMargin()}>
        <Row>
          <Col lg={11} xl={11}>
            <ListGroup>{renderTracks}</ListGroup>
          </Col>
          <Col lg={1} xl={1}>
            <PagingButtons
              settings={settings}
              pageDisabled={false}
              loadMore={loadMore}
              loadPrevious={loadPrevious}
              pages={[]}
              page={{}}
            />
          </Col>
        </Row>
      </Container>
    )
  };
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
        <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor }}>
          {track.name}
          <PlayNowButton track={track} settings={settings} />
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
