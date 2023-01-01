import { PropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { applyLighting } from '../../lib/lightingHelper';
import ControlButton from '../common/ControlButton';
import { getPlaylists, add, addTracksToPlaylist } from '../../lib/playlist-client';
import { getStatus, updateStatus } from '../../lib/status-client';
import NoResults from '../common/NoResults';
import PlaylistDetail from './PlaylistDetail';
import PlaylistRow from './PlaylistRow';
import ContentWithControls from '../common/ContentWithControls';
import { SettingsContext } from '../layout/SettingsProvider';
import './PlaylistsViewer.scss';
import AddNew from '../common/AddNew';
import { headerFooterReserve } from '../../lib/styleHelper';
import PaginatedList from '../common/PaginatedList';

const propTypes = {
  currentPlaylist: PropTypes.string,
};

const PlaylistsViewer = ({ currentPlaylist }) => {
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
  const [totalPlaylists, setTotalPlaylists] = useState(0);

  useEffect(() => {
    const itemHeight = 70;
    const reserve = headerFooterReserve(settings);
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
    applyLighting(settings, 'Playlists');
  }, []);

  const loadPlaylists = () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    getPlaylists(realStart, (realStart + realPageSize)).then((data) => {
      setPlaylists(data.playlists);
      setTotalPlaylists(data.totalPlaylists)

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

  const handleClose = (data) => {
    if ((typeof data) === 'string') {
      add({
        id: uuidv4(),
        name: data,
        tracks: [],
      }).then(() => {
        getPlaylists().then((playlistData) => {
          getStatus().then((status) => {
            updateStatus({ ...status, totalPlaylists: playlistData.length });
            loadPlaylists();
          });
        });
      });
    }
    setShow(false);
    loadPlaylists();
  };

  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const controls = <ControlButton text="Add" width="100%" onClick={handleShow} height={buttonHeight} style={{ fontSize }} />;

  const items = () => playlists.map(playlist => (
    <PlaylistRow
      playlist={playlist}
      addMode={tracks?.length && !added && settings}
      onAdd={() => {
        addTracksToPlaylist(playlist.name, tracks);
        setAdded(true);
        navigate(-1);
      }}
      onSelect={() => selectPlaylist(playlist.name)}
    />
  ));

  const content = () => (
    <>
      {!show && isEmpty && <NoResults applyMargin={false} title="No Playlists" text="No Playlists have been created. Click Add to create a new playlist." />}
      {show && <AddNew onCancel={() => setShow(false)} onConfirm={() => handleClose(document.getElementById('name').value)} />}
      {!show && !isEmpty && (
        <PaginatedList
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
          totalItems={totalPlaylists}
        />
      )}
    </>
  );

  if (!currentPlaylist.name && !name) {
    return (
      <ContentWithControls content={content()} controls={controls} />
    );
  }
  return (
    <PlaylistDetail name={name} handleBackToPlaylists={handleBackToPlaylists} />
  );
};

PlaylistsViewer.propTypes = propTypes;

PlaylistsViewer.defaultProps = {
  currentPlaylist: '',
};

export default PlaylistsViewer;
