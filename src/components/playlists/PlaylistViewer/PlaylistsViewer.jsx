import { PropTypes } from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage } from 'react-intl';

import './PlaylistsViewer.scss';
import { applyLighting } from '../../../lib/helper/lightingHelper';
import { getPlaylists, add, addTracksToPlaylist } from '../../../lib/service-clients/playlist-client';
import { getStatus, updateStatus } from '../../../lib/service-clients/status-client';
import { headerFooterReserve } from '../../../lib/helper/styleHelper';
import { SettingsContext } from '../../layout/SettingsProvider';
import AddNew from '../../common/AddNew/AddNew';
import ContentWithControls from '../../layout/ContentWithControls/ContentWithControls';
import ControlButton from '../../common/Buttons/ControlButton/ControlButton';
import PaginatedList from '../../common/PaginatedList/PaginatedList';
import PlaylistDetail from '../PlaylistDetail/PlaylistDetail';
import PlaylistRow from '../PlaylistRow/PlaylistRow';
import NoPlaylists from '../NoPlaylists/NoPlaylists';
import { usePlaylists } from '../../../hooks/use-playlists';

const propTypes = {
  currentPlaylist: PropTypes.string,
};

const PlaylistsViewer = ({ currentPlaylist }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tracks = state?.tracks;
  const settings = useContext(SettingsContext);
  const [name, setName] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [added, setAdded] = useState(false);
  const selectPlaylist = playlistName => setName(playlistName);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState();
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const { playlists, totalPlaylists, isEmpty } = usePlaylists(selectedPage, pageSize)

  useEffect(() => {
    const itemHeight = 70;
    const reserve = headerFooterReserve(settings);
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setPageSize(Math.floor(viewPortHeight / itemHeight));
    applyLighting(settings, 'Playlists');
  }, []);

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
            navigate('/playlists');
          });
        });
      });
    }
    navigate('/playlists');
    setAddMode(false);
  };

  const items = () => playlists.map(playlist => (
    <PlaylistRow
      playlist={playlist}
      addMode={tracks?.length && !added}
      onSelect={() => {
        if (tracks?.length) {
          addTracksToPlaylist(playlist.name, tracks);
          setAdded(true);
          navigate(-1);
        } else {
          selectPlaylist(playlist.name)
        }
      }}
    />
  ));

  const controls = (
    <>
      {!addMode && (
        <ControlButton
          text={<FormattedMessage id="add" />}
          width={settings?.screen.isMobile ? "97%" : "100%"}
          onClick={() => setAddMode(true)}
          height={buttonHeight}
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

  return !currentPlaylist.name && !name ? (
    <ContentWithControls content={content()} controls={controls} />
  ) : (
    <PlaylistDetail name={name} />
  );
};

PlaylistsViewer.propTypes = propTypes;

PlaylistsViewer.defaultProps = {
  currentPlaylist: '',
};

export default PlaylistsViewer;
