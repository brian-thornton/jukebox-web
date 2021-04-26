import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroup, ListGroupItem, Button, Row, Col, Container,
} from 'react-bootstrap';
import PlaylistClient from '../lib/playlist-client';
import StatusClient from '../lib/status-client';
import PlaylistDetail from './PlaylistDetail';
import PlaylistAddModal from './PlaylistAddModal';
import styles from './styles';
import ContentWithControls from './ContentWithControls';
import { Settings, Tracks } from './shapes';
import { buttonProps } from '../lib/styleHelper';
import PagingButtons from './PagingButtons';
import { findPage } from '../lib/pageHelper';

import { controlButtonProps } from '../lib/styleHelper';
import { BlockPicker } from 'react-color';

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
  pages,
  totalPlaylists,
  pageSize,
  initialPage,
  setPage,
  page,
}) {
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [added, setAdded] = useState(false);
  const selectPlaylist = playlistName => setName(playlistName);
  const renderPlaylists = [];
  const alertText = 'Playlists';
  const isScreenSmall = window.innerWidth < 700;

  const loadPlaylists = (loadPage) => {
    const start = loadPage ? loadPage.start : page.start;
    let limit = loadPage ? loadPage.limit : page.limit;

    if (start === 0) {
      limit += 1;
    }

    PlaylistClient.getPlaylists(start, limit).then((data) => {
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
      }).then(() => {
        PlaylistClient.getPlaylists().then((data) => {
          StatusClient.getStatus().then((status) => {
            StatusClient.updateStatus({ ...status, totalPlaylists: data.length });
          });
        });
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
          style={{ ...styles.cardStyle, width: '90%', color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor }}
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

  useEffect(() => {
    loadPlaylists();
  }, [page])

  const loadMore = () => setPage(pages[findPage(pages, page) + 1]);
  const loadPrevious = () => setPage(pages[findPage(pages, page) - 1]);

  const playlistsMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', height: '100%' };
  };

  const content = () => {
    return (
      <Container id="albums" fluid style={playlistsMargin()}>
        <Row>
          <Col lg={11} xl={11}>
            <Row>{renderPlaylists}</Row>
          </Col>
          <Col lg={1} xl={1}>
            <PagingButtons
              settings={settings}
              pageDisabled={false}
              loadMore={loadMore}
              loadPrevious={loadPrevious}
              pages={pages}
              page={page}
            />
          </Col>
        </Row>
      </Container>
    );
  };

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
