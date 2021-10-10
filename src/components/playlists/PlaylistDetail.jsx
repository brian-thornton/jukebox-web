import { CaretDownFill, CaretUpFill, TrashFill } from 'react-bootstrap-icons';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { ListGroup } from 'react-bootstrap';
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
import Modal from '../common/Modal';
import NoResults from '../common/NoResults';
import PlaylistAddModal from './PlaylistAddModal';
import PlayNowButton from '../PlayNowButton';
import Item from '../common/Item';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

function PlaylistDetail({ name, handleBackToPlaylists }) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  let renderTracks = [];

  const loadTracks = (playlistName) => {
    getPlaylist(playlistName).then((playlist) => {
      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
      }
    });
  };

  const runPlaylist = () => {
    enqueueTracksTop(tracks);
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
    renderTracks = tracks.map((track, index) => (
      <Item text={track.name} buttons={buttons(track, index)} />
    ));
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
    deletePlaylist(name).then(() => {
      handleBackToPlaylists();
    });
  };

  const controls = () => (
    <>
      <ControlButton onClick={handleBackToPlaylists} text="Back to Playlists" />
      <ControlButton onClick={runPlaylist} disabled={isEmpty} text="Run Playlist" />
      <ControlButton onClick={enqueuePlaylist} disabled={isEmpty} text="Enqueue Playlist" />
      <ControlButton onClick={shuffle} disabled={isEmpty} text="Shuffle Playlist" />
      <ControlButton onClick={() => setIsSaveAsOpen(true)} disabled={isEmpty} text="Save As..." />
      <ControlButton onClick={() => setShowDeleteModal(true)} text="Delete Playlist" />
    </>
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults title="Empty Playlist" text="This playlist contains no tracks. Please add tracks from the albums or tracks sections." />;
    }

    return (
      <ListGroup>
        {renderTracks}
      </ListGroup>
    );
  };

  return (
    <>
      <ContentWithControls
        controls={controls()}
        content={content()}
      />
      <PlaylistAddModal
        isOpen={isSaveAsOpen}
        handleClose={() => setIsSaveAsOpen(false)}
        handleSave={handleSave}
        existingPlaylistName={name}
      />
      <Modal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Playlist?"
        body="Are you sure that you want to delete the playlist?"
        confirmText="Yes"
      />
    </>
  );
}

PlaylistDetail.propTypes = propTypes;

export default PlaylistDetail;
