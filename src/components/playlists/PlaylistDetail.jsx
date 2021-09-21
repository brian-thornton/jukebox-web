import React, { useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, Button,
} from 'react-bootstrap';
import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  getPlaylist,
  deletePlaylist,
  add,
  removeTracksFromPlaylist,
} from '../../lib/playlist-client';

import ControlButton from '../common/ControlButton';
import ContentWithControls from '../common/ContentWithControls';
import NoResults from '../common/NoResults';
import PlaylistAddModal from './PlaylistAddModal';
import ConfirmationModal from '../common/ConfirmationModal';
import { buttonProps, controlButtonProps } from '../../lib/styleHelper';
import PlayNowButton from '../PlayNowButton';
import EnqueueButton from '../EnqueueButton';
import Item from '../common/Item';
import { getHeight, nextPage, previousPage, initializePaging } from '../../lib/pageHelper';
import { SettingsContext } from '../layout/Jukebox';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

function PlaylistDetail({ name, handleBackToPlaylists }) {
  const settings = useContext(SettingsContext);
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  let renderTracks = [];

  const loadTracks = (name) => {
    getPlaylist(name).then((playlist) => {
      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
        setPaging(initializePaging(playlist.tracks.length, 100, initialHeight));
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

  const deleteTrack = (name, track) => {
    removeTracksFromPlaylist(name, [track]);
    loadTracks(name);
  };

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  const buttons = (track) => (
    <>
      <PlayNowButton track={track} />
      <EnqueueButton track={track} />
      <Button
        {...buttonProps(settings)}
        onClick={() => deleteTrack(name, track)}
      >
        Delete
      </Button>
    </>
  );

  if (tracks) {
    renderTracks = tracks.map((track) => <Item text={track.name} buttons={buttons(track)} />);
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
      <ConfirmationModal
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
