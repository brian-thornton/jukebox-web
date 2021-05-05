import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import Playlists from './playlists/Playlists';
import QueueClient from '../lib/queue-client';
import styles from './styles';
import ContentWithControls from './common/ContentWithControls';
import { Settings } from './shapes';
import { controlButtonProps } from '../lib/styleHelper';
import PlayNowButton from './PlayNowButton';
import PagingButtons from './common/PagingButtons';
import { getHeight, initializePaging, nextPage, previousPage } from '../lib/pageHelper';

const propTypes = {
  settings: Settings.isRequired,
};

function Queue({ settings }) {
  const [tracks, setTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
  const renderTracks = [];

  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  const clear = () => QueueClient.clearQueue().then(loadQueue());
  const message = 'There are no tracks in the queue.';
  const alert = (<Alert variant="primary">{message}</Alert>);

  const loadQueue = (loadPage) => {
    const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

    if (start === 0) {
      limit += 1;
    }

    QueueClient.getQueue(start, limit).then((data) => {
      setTracks(data.tracks);
      setIsLoading(false);
      setIsLoaded(true);

      if (!paging) {
        setPaging(initializePaging(data.totalTracks, 250, initialHeight));
      }
    });
  };

  // const refreshQueue = () => {
  //   loadQueue(queuePage);
  //   setTimeout(() => {
  //     refreshQueue();
  //   }, 3000)
  // };

  // if (!isIntervalSet) {
  //   setIsIntervalSet(true);
  //   setTimeout(() => {
  //     refreshQueue();
  //   }, 3000);
  // }

  useEffect(() => {
    if (paging) {
      loadQueue(paging.currentPage);
    }
  }, [paging]);

  const queueMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', height: '100%' };
  };

  const content = () => {
    if (paging) {
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
                loadMore={() => setPaging(nextPage(paging))}
                loadPrevious={() => setPaging(previousPage(paging))}
                pages={paging.pages}
                page={paging.currentPage}
              />
            </Col>
          </Row>
        </Container>
      )
    }
    return null;
  };

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
