import React, { useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';

import Button from '../Button';
import ControlButton from '../common/ControlButton';
import { getPlaylists, add, addTracksToPlaylist } from '../../lib/playlist-client';
import { getStatus, updateStatus } from '../../lib/status-client';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';
import PlaylistDetail from './PlaylistDetail';
import PlaylistAddModal from './PlaylistAddModal';
import ContentWithControls from '../common/ContentWithControls';
import Item from '../common/Item';
import { Tracks } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  currentPlaylist: PropTypes.string,
  tracks: Tracks.isRequired,
};

function PlaylistsViewer({
  currentPlaylist,
}) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tracks = state?.tracks;
  const settings = useContext(SettingsContext);
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [added, setAdded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const selectPlaylist = playlistName => setName(playlistName);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  let renderPlaylists = [];
  const isScreenSmall = window.innerWidth < 700;
  const playlistsMargin = isScreenSmall ? {} : { marginLeft: '0px', height: '100%' };

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const loadPlaylists = () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    getPlaylists(realStart, (realStart + realPageSize)).then((data) => {
      setPlaylists(data.playlists);
      if (data.playlists.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    });
  };

  useEffect(() => {
    loadPlaylists();
  }, [selectedPage, realPageSize]);

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
        getPlaylists().then((playlistData) => {
          getStatus().then((status) => {
            updateStatus({ ...status, totalPlaylists: playlistData.length });
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
    if (tracks?.length && !added && settings) {
      playlistActions.push((
        <Button
          onClick={() => {
            addToPlaylist(playlistName);
            setAdded(true);
            navigate(-1);
          }}
          content="Add"
        />
      ));
    } else {
      playlistActions.push((
        <Button
          onClick={() => selectPlaylist(playlistName)}
          content="Edit"
        />
      ));
      playlistActions.push((
        <Button
          icon={<Trash />}
          onClick={() => selectPlaylist(playlistName)}
        />
      ));
    }

    return playlistActions;
  };

  renderPlaylists = playlists.map(playlist => (
    <Item
      onClick={() => selectPlaylist(playlist.name)}
      text={playlist.name}
      buttons={buttons(playlist.name)}
    />
  ));

  const controls = () => {
    if (tracks?.length) {
      return <></>;
    }

    return <ControlButton text="Add" onClick={handleShow} />;
  };

  const content = () => {
    if (isEmpty) {
      return <NoResults title="No Playlists" text="No Playlists have been created. Click Add to create a new playlist." />;
    }

    return (
      <Container id="albums" fluid style={playlistsMargin}>
        <Row>
          {renderPlaylists}
        </Row>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paginator
            onPageChange={(page) => setSelectedPage(page)}
            style={{ marginTop: '100px' }}
            selectedPage={selectedPage}
            totalItems={playlists.length}
            pageSize={realPageSize}
            disableRandom
          />
        </Row>
      </Container >
    );
  };

  if (!currentPlaylist.name && !name) {
    return (
      <>
        <ContentWithControls content={content()} controls={controls()} />
        <PlaylistAddModal isOpen={show} handleClose={() => setShow(false)} handleSave={() => handleClose(document.getElementById('name').value)} />
      </>
    );
  }
  return (
    <PlaylistDetail name={name} handleBackToPlaylists={handleBackToPlaylists} />
  );
}

PlaylistsViewer.propTypes = propTypes;

PlaylistsViewer.defaultProps = {
  currentPlaylist: '',
};

export default PlaylistsViewer;
