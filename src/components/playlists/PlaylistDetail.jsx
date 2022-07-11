import { ArrowLeft, CaretRightFill, CaretDownFill, CaretUpFill, TrashFill, ListOl, Shuffle, Save, XLg } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Container, Row, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Confirm from '../common/Confirm';
import Paginator from '../common/Paginator';
import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  addTrackAtPosition,
  getPlaylist,
  deletePlaylist,
  add,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';
import Button from '../Button';
import ControlButton from '../common/ControlButton';
import ContentWithControls from '../common/ContentWithControls';
import NoResults from '../common/NoResults';
import PlayNowButton from '../PlayNowButton';
import Item from '../common/Item';
import { toastProps } from '../common/toast-helper';
import AddNew from '../common/AddNew';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './PlaylistDetail.module.css';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const PlaylistDetail = ({ name, handleBackToPlaylists }) => {
  const settings = useContext(SettingsContext);
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  let renderTracks = [];
  const isScreenSmall = window.innerWidth < 700;

  useEffect(() => {
    const itemHeight = isScreenSmall ? 90 : 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const loadTracks = (playlistName) => {
    getPlaylist(playlistName).then((playlist) => {
      setSelectedPlaylist(playlist);

      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
      }
    });
  };

  const runPlaylist = () => {
    enqueueTracksTop(tracks).then(() => toast.success("Playlist added to queue!", toastProps));
    play();
  };

  const enqueuePlaylist = () => {
    enqueueTracks(tracks);
  };

  const shuffle = () => {
    deletePlaylist(name).then(() => {
      const newOrder = tracks.sort(() => Math.random() - 0.5);

      add({
        name,
        tracks: newOrder,
      }).then(() => loadTracks(name));
    });
  };

  const handleSave = (data) => {
    if ((typeof data) === 'string') {
      add({
        name: data,
        tracks,
      });
    }
    setIsSaveAsOpen(false);
    handleBackToPlaylists();
  };

  const deleteTrack = (trackName, track) => {
    removeTracksFromPlaylist(trackName, [track]);
    loadTracks(name);
  };

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  const onMoveTrackUp = (trackToMove, index) => {
    removeTracksFromPlaylist(name, [trackToMove]);
    addTrackAtPosition(name, trackToMove, index - 1);
    loadTracks(name);
  };

  const onMoveTrackDown = (trackToMove, index) => {
    removeTracksFromPlaylist(name, [trackToMove]).then(() => {
      addTrackAtPosition(name, trackToMove, index + 1);
      loadTracks(name);
    });
  };

  const buttons = (track, index) => (
    <>
      <PlayNowButton track={track} />
      <Button onClick={() => deleteTrack(name, track)} icon={<TrashFill />} />
      <Button icon={<CaretUpFill />} onClick={() => onMoveTrackUp(track, index)} />
      <Button icon={<CaretDownFill />} onClick={() => onMoveTrackDown(track, index)} />
    </>
  );

  if (tracks) {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    renderTracks = tracks.slice(realStart, (realStart + realPageSize)).map((track, index) => (
      <Item text={track.name} buttons={buttons(track, index)} />
    ));
  }

  const handleDelete = () => {
    deletePlaylist(name).then(() => {
      setShowDeleteModal(false);
      handleBackToPlaylists();
    });
  };

  const controls = () => (
    <>
      <ControlButton disabled={showDeleteModal} onClick={handleBackToPlaylists} text="Back to Playlists" />
      {settings.features.play && <ControlButton disabled={showDeleteModal || isEmpty} onClick={runPlaylist} text="Run Playlist" />}
      {settings.features.queue && <ControlButton disabled={showDeleteModal || isEmpty} onClick={enqueuePlaylist} text="Enqueue Playlist" />}
      <ControlButton disabled={showDeleteModal || isEmpty} onClick={shuffle} text="Shuffle Playlist" />
      <ControlButton disabled={showDeleteModal || isEmpty} onClick={() => setIsSaveAsOpen(true)} text="Save As..." />
      {settings.features.deletePlaylist && <ControlButton disabled={showDeleteModal} onClick={() => setShowDeleteModal(true)} text="Delete Playlist" />}
    </>
  );

  const smallControls = () => (
    <>
      <Button disabled={showDeleteModal} onClick={handleBackToPlaylists} icon={<ArrowLeft />} />
      {settings.features.play && <Button disabled={showDeleteModal || isEmpty} onClick={runPlaylist} icon={<CaretRightFill />} />}
      {settings.features.queue && <Button disabled={showDeleteModal || isEmpty} onClick={enqueuePlaylist} icon={<ListOl />} />}
      <Button disabled={showDeleteModal || isEmpty} onClick={shuffle} icon={<Shuffle />} />
      <Button disabled={showDeleteModal || isEmpty} onClick={() => setIsSaveAsOpen(true)} icon={<Save />} />
      <Button disabled={showDeleteModal} onClick={() => setShowDeleteModal(true)} icon={<XLg />} />
    </>
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults title="Empty Playlist" text="This playlist contains no tracks. Please add tracks from the albums or tracks sections." />;
    }

    return (
      <>
        <ListGroup>
          {renderTracks}
        </ListGroup>
        <Paginator
          disableRandom
          onPageChange={(page) => setSelectedPage(page)}
          selectedPage={selectedPage}
          totalItems={tracks.length}
          pageSize={realPageSize}
        />
      </>
    );
  };

  const confirm = (
    <Confirm
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      title="Are you sure that you want to delete the playlist?"
    />
  );

  return (
    <>
      {!showDeleteModal && (
        <>
          {!isScreenSmall && (
            <ContentWithControls
              controls={controls()}
              content={content()}
            />
          )}
          {isScreenSmall && (
            <Container style={{ marginBottom: '60px' }}>
              <Row>
                {smallControls()}
              </Row>
              <Row>
                <ListGroup>
                  {renderTracks}
                </ListGroup>
              </Row>
              <Row className={styles.detailRow}>
                <Paginator
                  disableRandom
                  onPageChange={(page) => setSelectedPage(page)}
                  selectedPage={selectedPage}
                  totalItems={tracks.length}
                  pageSize={realPageSize}
                />
              </Row>
            </Container>
          )}
          {isSaveAsOpen && (
            <AddNew
              onCancel={() => setIsSaveAsOpen(false)}
              onConfirm={() => handleSave}
            />
          )}
        </>
      )}
      {showDeleteModal && (
        <>
          {!isScreenSmall && (
            <ContentWithControls
              controls={controls()}
              content={confirm}
            />
          )}
          {isScreenSmall && confirm}
        </>
      )}
    </>
  );
}

PlaylistDetail.propTypes = propTypes;

export default PlaylistDetail;
