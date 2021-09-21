import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';

import ControlButton from './common/ControlButton';
import Playlists from './playlists/Playlists';
import {
  clearQueue,
  getQueue,
  enqueueTracks,
  removeTracksFromQueue,
} from '../lib/queue-client';

import ContentWithControls from './common/ContentWithControls';
import PlayNowButton from './PlayNowButton';
import Item from './common/Item';
import NoResults from './common/NoResults';
import PagedContainer from './common/PagedContainer';
import { getHeight, initializePaging } from '../lib/pageHelper';
import { SettingsContext } from './layout/Jukebox';
import { buttonProps } from '../lib/styleHelper';

function Queue() {
  const settings = useContext(SettingsContext);
  const [tracks, setTracks] = useState([]);
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  let renderTracks = [];

  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  const clear = () => clearQueue().then(loadQueue());

  const loadQueue = (loadPage) => {
    const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

    if (start === 0) {
      limit += 1;
    }

    getQueue(start, limit).then((data) => {
      setTracks(data.tracks);
      if (data.tracks.length === 0) {
        setIsEmpty(true);
      }
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
    if (isEmpty) {
      return <NoResults title="Queue Empty" text="The queue is empty. Enqueue tracks from the albums, tracks or playlist sections and your tracks will play next!" />;
    }

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

  renderTracks = tracks.map((track) => (
    <Item
      text={track.name}
      buttons={(
        <>
          <PlayNowButton track={track} />
          <Button {...buttonProps(settings)} onClick={() => remove(track)}>Delete</Button>
        </>
      )}
    />
  ));

  const controls = () => (
    <>
      <ControlButton onClick={clear} disabled={isEmpty} text="Clear Queue" />
      <ControlButton onClick={() => shuffle()} disabled={isEmpty} text="Shuffle Queue" />
      <ControlButton onClick={() => setAddToPlaylist(true)} disabled={isEmpty} text="Save to Playlist" />
    </>
  );

  if (!addToPlaylist) {
    return <ContentWithControls controls={controls()} content={content()} />;
  }
  return (<Playlists mode="addToPlaylist" tracks={tracks} />);
}

export default Queue;
