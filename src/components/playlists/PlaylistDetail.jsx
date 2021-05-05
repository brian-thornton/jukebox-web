import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import QueueClient from '../../lib/queue-client';
import PlaylistClient from '../../lib/playlist-client';
import ContentWithControls from '../common/ContentWithControls';
import PlaylistAddModal from './PlaylistAddModal';
import PlaylistDeleteModal from './PlaylistDeleteModal';
import styles from '../styles';
import { buttonProps } from '../../lib/styleHelper';
import { Settings } from '../shapes';
import { controlButtonProps } from '../../lib/styleHelper';
import PlayNowButton from '../PlayNowButton';
import EnqueueButton from '../EnqueueButton';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  settings: Settings.isRequired,
};

function PlaylistDetail({ name, handleBackToPlaylists, settings }) {
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
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

  const runPlaylist = () => {
    QueueClient.enqueueTracksTop(tracks);
    QueueClient.play();
  }

  const enqueuePlaylist = () => {
    QueueClient.enqueueTracks(tracks);
  }

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

  const renderTracks = [];

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  if (tracks) {
    tracks.forEach((track) => {
      renderTracks.push(
        (
          <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor  }}>
            {track.name}
            <PlayNowButton track={track} settings={settings} />
            <EnqueueButton track={track} settings={settings} />
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
      <Button {...controlButtonProps(settings)} onClick={handleBackToPlaylists}>Back to Playlists</Button>
      <Button {...controlButtonProps(settings)} onClick={runPlaylist}>Run Playlist</Button>
      <Button {...controlButtonProps(settings)} onClick={enqueuePlaylist}>Enqueue Playlist</Button>
      <Button {...controlButtonProps(settings)} onClick={shuffle}>Shuffle Playlist</Button>
      <Button {...controlButtonProps(settings)} onClick={() => setIsSaveAsOpen(true)}>Save As...</Button>
      <Button {...controlButtonProps(settings)} onClick={() => setShowDeleteModal(true)}>Delete Playlist</Button>
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
        settings={settings}
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
