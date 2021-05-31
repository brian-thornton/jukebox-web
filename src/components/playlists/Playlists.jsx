import React, { useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import {
  Button, Row, Col, Container,
} from 'react-bootstrap';
import { getPlaylists, add, addTracksToPlaylist } from '../../lib/playlist-client';
import { getStatus, updateStatus } from '../../lib/status-client';
import PlaylistDetail from './PlaylistDetail';
import PlaylistAddModal from './PlaylistAddModal';
import ContentWithControls from '../common/ContentWithControls';
import Item from '../common/Item';
import { Tracks } from '../shapes';
import { buttonProps, controlButtonProps } from '../../lib/styleHelper';
import PagingButtons from '../common/PagingButtons';
import {
  getHeight,
  initializePaging,
  previousPage,
  nextPage
} from '../../lib/pageHelper';
import { SettingsContext } from '../layout/Jukebox'; 

const propTypes = {
  currentPlaylist: PropTypes.string,
  mode: PropTypes.string,
  tracks: Tracks.isRequired,
};

function Playlists({
  tracks,
  mode,
  currentPlaylist,
}) {
  const settings = useContext(SettingsContext);
  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
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
    const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

    if (start === 0) {
      limit += 1;
    }

    getPlaylists(start, limit).then((data) => {
      setPlaylists(data.playlists);
      if (!paging) {
        setPaging(initializePaging(data.totalPlaylists, 60, initialHeight));
      }
    });
  };

  useEffect(() => {
    if (paging) {
      loadPlaylists(paging.currentPage);
    }
  }, [paging]);

  const handleBackToPlaylists = () => {
    setName('');
    loadPlaylists();
  };

  if (!playlists.length) {
    loadPlaylists();
  }

  const handleClose = (data) => {
    if ((typeof data) === 'string') {
      add({
        name: data,
        tracks: [],
      }).then(() => {
        getPlaylists().then((data) => {
          getStatus().then((status) => {
            updateStatus({ ...status, totalPlaylists: data.length });
          });
        });
      });
    }
    setShow(false);
    loadPlaylists();
  };

  const addToPlaylist = (playlistName) => {
    addTracksToPlaylist(playlistName, tracks);
  };

  const buttons = (playlistName) => {
    const playlistActions = [];
    if (mode === 'addToPlaylist' && !added && settings) {
      playlistActions.push((
        <Button
          {...buttonProps(settings)}
          onClick={() => {
            addToPlaylist(playlistName);
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
        <Item
          onClick={() => selectPlaylist(playlist.name)}
          text={playlist.name}
          buttons={buttons(playlist.name)}
        />
      ),
    );
  });

  const controls = () => (
    <Button {...controlButtonProps(settings)} onClick={handleShow}>Add</Button>
  );

  const playlistsMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', height: '100%' };
  };

  const content = () => {
    if (paging) {
      return (
        <Container id="albums" fluid style={playlistsMargin()}>
          <Row>
            <Col lg={11} xl={11}>
              <Row>{renderPlaylists}</Row>
            </Col>
            <Col lg={1} xl={1}>
              <PagingButtons
                pageDisabled={false}
                loadMore={() => setPaging(nextPage(paging))}
                loadPrevious={() => setPaging(previousPage(paging))}
                pages={paging.pages}
                page={paging.currentPage}
              />
            </Col>
          </Row>
        </Container>
      );
    }

    return null;
  };

  if (!currentPlaylist.name && !name) {
    return (
      <React.Fragment>
        <ContentWithControls content={content()} controls={controls()} alertText={alertText} />
        <PlaylistAddModal isOpen={show} handleClose={() => setShow(false)} handleSave={() => handleClose(document.getElementById('name').value)} />
      </React.Fragment>
    );
  }
  return (
    <PlaylistDetail name={name} handleBackToPlaylists={handleBackToPlaylists} />
  );
}

Playlists.propTypes = propTypes;

Playlists.defaultProps = {
  currentPlaylist: '',
  mode: '',
};


export default Playlists;
