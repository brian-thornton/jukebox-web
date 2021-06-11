import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
} from 'react-bootstrap';
import Playlists from './playlists/Playlists';
import {
  clearQueue,
  getQueue,
  enqueueTracks,
  removeTracksFromQueue,
} from '../lib/queue-client';
import styles from './styles';
import ContentWithControls from './common/ContentWithControls';
import { controlButtonProps } from '../lib/styleHelper';
import PlayNowButton from './PlayNowButton';
import Item from './common/Item';
import PagedContainer from './common/PagedContainer';
import { getHeight, initializePaging } from '../lib/pageHelper';
import { SettingsContext } from './layout/Jukebox';
import { buttonProps } from '../lib/styleHelper';

function Queue() {
  const settings = useContext(SettingsContext);
  const [tracks, setTracks] = useState([]);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const renderTracks = [];

  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  const clear = () => clearQueue().then(loadQueue());
  const message = 'There are no tracks in the queue.';
  const alert = (<Alert variant="primary">{message}</Alert>);

  const loadQueue = (loadPage) => {
    const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

    if (start === 0) {
      limit += 1;
    }

    getQueue(start, limit).then((data) => {
      setTracks(data.tracks);

      if (!paging) {
        setPaging(initializePaging(data.totalTracks, 90, initialHeight));
      }
    });
  };

  useEffect(() => loadQueue(), []);

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

  const content = () => {
    if (paging) {
      return (
        <PagedContainer
          setPaging={setPaging}
          paging={paging}
          content={renderTracks}
        />
      );
    }
    return null;
  };

  const shuffle = () => {
    clearQueue().then(() => {
      enqueueTracks(tracks.sort(() => Math.random() - 0.5)).then(() => {
        loadQueue();
      });
    });
  };

  const remove = (track) => {
    removeTracksFromQueue([track]);
    loadQueue();
  };

  tracks.forEach((track) => {
    renderTracks.push(
      (
        <Item
          text={track.name}
          buttons={(
            <>
              <PlayNowButton track={track} />
              <Button {...buttonProps(settings)} onClick={() => remove(track)}>Delete</Button>
            </>
          )}
        />
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
