import { PropTypes } from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage } from 'react-intl';

import './PlaylistsViewer.scss';
import { applyLighting } from '../../lib/lightingHelper';
import { getPlaylists, add, addTracksToPlaylist } from '../../lib/playlist-client';
import { getStatus, updateStatus } from '../../lib/status-client';
import { headerFooterReserve } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import AddNew from '../common/AddNew';
import ContentWithControls from '../common/ContentWithControls';
import ControlButton from '../common/ControlButton';
import PaginatedList from '../common/PaginatedList';
import PlaylistDetail from './PlaylistDetail';
import PlaylistRow from './PlaylistRow';
import NoPlaylists from './NoPlaylists';

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
  const [addMode, setAddMode] = useState(false);
  const [added, setAdded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const selectPlaylist = playlistName => setName(playlistName);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState();
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

  const loadPlaylists = () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);

    getPlaylists(start, (start + pageSize)).then((data) => {
      setPlaylists(data.playlists);
      setTotalPlaylists(data.totalPlaylists);
      setIsEmpty(data.playlists.length === 0);
    });
  };

  useEffect(() => {
    const itemHeight = 70;
    const reserve = headerFooterReserve(settings);
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setPageSize(Math.floor(viewPortHeight / itemHeight));
    applyLighting(settings, 'Playlists');
  }, []);

  useEffect(() => {
    if (pageSize) {
      loadPlaylists();
    }
  }, [selectedPage, pageSize]);

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
    setAddMode(false);
    loadPlaylists();
  };

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

  const controls = (
    <>
      {!addMode && (
        <ControlButton
          text={<FormattedMessage id="add" />}
          width="100%"
          onClick={() => setAddMode(true)}
          height={buttonHeight}
          style={{ fontSize }}
        />
      )}
    </>
  );

  const content = () => (
    <>
      {playlists?.length === 0 && !addMode && <NoPlaylists />}
      {addMode && (
        <AddNew
          fields={{ name: 'Name' }}
          onCancel={() => setAddMode(false)}
          onConfirm={() => handleClose(document.getElementById('name').value)}
          confirmText='Add'
          cancelText='Cancel'
        />
      )}
      {!addMode && !isEmpty && (
        <PaginatedList
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={pageSize}
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
