import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import PlaylistClient from '../lib/playlist-client';
import PlaylistDetail from './PlaylistDetail';
import PlaylistAddModal from './PlaylistAddModal';
import styles from './styles';
import ContentWithControls from './ContentWithControls';
import { Settings, Tracks } from './shapes';
import { buttonProps } from '../lib/styleHelper';

import { controlButtonProps } from '../lib/styleHelper';

const propTypes = {
  currentPlaylist: PropTypes.string,
  mode: PropTypes.string,
  settings: Settings.isRequired,
  tracks: Tracks.isRequired,
};

function Playlists({
  tracks,
  mode,
  currentPlaylist,
  settings,
}) {
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [added, setAdded] = useState(false);
  const selectPlaylist = playlistName => setName(playlistName);
  const renderPlaylists = [];
  const alertText = 'Playlists';

  const loadPlaylists = () => {
    PlaylistClient.getPlaylists().then((data) => {
      setPlaylists(data);
    });
  };

  const handleBackToPlaylists = () => {
    setName('');
    loadPlaylists();
  };

  if (!playlists.length) {
    loadPlaylists();
  }

  const handleClose = (data) => {
    if ((typeof data) === 'string') {
      PlaylistClient.add({
        name: data,
        tracks: [],
      });
    }
    setShow(false);
    loadPlaylists();
  };

  const addTracksToPlaylist = (playlistName) => {
    PlaylistClient.addTracksToPlaylist(playlistName, tracks);
  };

  const buttons = (playlistName) => {
    const playlistActions = [];
    if (mode === 'addToPlaylist' && !added && settings) {
      playlistActions.push((
        <Button
          {...buttonProps(settings)}
          onClick={() => {
            addTracksToPlaylist(playlistName);
            setAdded(true);
          }}
        >
          Add
        </Button>
      ));
    }

    return playlistActions;
  };

  playlists.forEach((playlist) => {
    renderPlaylists.push(
      (
        <ListGroupItem
          onClick={() => selectPlaylist(playlist.name)}
          style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor  }}
          key={playlist.name}
        >
          { playlist.name}
          { buttons(playlist.name)}
        </ListGroupItem>
      ),
    );
  });

  const controls = () => (
    <Button {...controlButtonProps(settings)} onClick={handleShow}>Add</Button>
  );

  const content = () => <ListGroup>{renderPlaylists}</ListGroup>;

  if (!currentPlaylist.name && !name) {
    return (
      <React.Fragment>
        <ContentWithControls content={content()} controls={controls()} alertText={alertText} />
        <PlaylistAddModal settings={settings} isOpen={show} handleClose={() => setShow(false)} handleSave={() => handleClose(document.getElementById('name').value)} />
      </React.Fragment>
    );
  }
  return (
    <PlaylistDetail name={name} handleBackToPlaylists={handleBackToPlaylists} settings={settings} />
  );
}

Playlists.propTypes = propTypes;

Playlists.defaultProps = {
  currentPlaylist: '',
  mode: '',
};


export default Playlists;
