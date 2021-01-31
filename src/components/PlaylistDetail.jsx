import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import QueueClient from '../lib/queue-client';
import PlaylistClient from '../lib/playlist-client';
import ContentWithControls from './ContentWithControls';
import PlaylistAddModal from './PlaylistAddModal';
import PlaylistDeleteModal from './PlaylistDeleteModal';
import styles from './styles';
import { buttonProps } from '../lib/styleHelper';
import { Settings } from './shapes';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  settings: Settings.isRequired,
};

function PlaylistDetail({ name, handleBackToPlaylists, settings }) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const leftButtonStyle = { margin: '5px', width: '150px' };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);

  const loadTracks = (name) => {
    PlaylistClient.getPlaylist(name).then((playlist) => {
      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
      }
    });
  };

  const playNow = (track) => {
    QueueClient.enqueueTop(track.path);
    QueueClient.play();
  };

  const shuffle = () => {
    PlaylistClient.delete(name).then(() => {
      const newOrder = tracks.sort(() => Math.random() - 0.5);

      PlaylistClient.add({
        name,
        tracks: newOrder,
      }).then(() => loadTracks(name));
    });
  };

  const handleSave = (data) => {
    if ((typeof data) === 'string') {
      PlaylistClient.add({
        name: data,
        tracks: tracks,
      });
    }
    setIsSaveAsOpen(false);
    handleBackToPlaylists();
  };

  const deleteTrack = (name, track) => {
    PlaylistClient.removeTracksFromPlaylist(name, [track]);
    loadTracks(name);
  };

  const leftButtonProps = {
    style: { ...leftButtonStyle, background: settings.styles.buttonBackgroundColor },
    variant: 'outline-light',
    className: 'float-right',
  };

  const renderTracks = [];

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  if (tracks) {
    tracks.forEach((track) => {
      renderTracks.push(
        (
          <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor }}>
            {track.name}
            <Button {...buttonProps(settings)} onClick={() => playNow(track)}>Play</Button>
            <Button {...buttonProps(settings)} onClick={() => QueueClient.enqueue(track)}>Enqueue</Button>
            <Button {...buttonProps(settings)} onClick={() => deleteTrack(name, track)}>Delete</Button>
          </ListGroupItem>
        ),
      );
    });
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
    PlaylistClient.delete(name).then(() => {
      handleBackToPlaylists();
    });
  };

  const controls = () => (
    <React.Fragment>
      <Button {...leftButtonProps} onClick={handleBackToPlaylists}>Back to Playlists</Button>
      <Button {...leftButtonProps} onClick={shuffle}>Shuffle Playlist</Button>
      <Button {...leftButtonProps} onClick={() => setIsSaveAsOpen(true)}>Save As...</Button>
      <Button {...leftButtonProps} onClick={() => setShowDeleteModal(true)}>Delete Playlist</Button>
    </React.Fragment>
  );

  const content = () => (<ListGroup>{renderTracks}</ListGroup>);
  return (
    <React.Fragment>
      <ContentWithControls
        alertText={`Playlist: ${name}`}
        controls={controls()}
        content={content()}
      />
      <PlaylistAddModal
        isOpen={isSaveAsOpen}
        handleClose={() => setIsSaveAsOpen(false)}
        handleSave={handleSave}
        existingPlaylistName={name}
      />
      <PlaylistDeleteModal
        isOpen={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDelete}
      />
    </React.Fragment>
  );
}

PlaylistDetail.propTypes = propTypes;

export default PlaylistDetail;
