import { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Confirm from '../../common/Confirm/Confirm';
import {
  getPlaylist,
  deletePlaylist,
  add,
} from '../../../lib/service-clients/playlist-client';
import ContentWithControls from '../../common/ContentWithControls/ContentWithControls';
import NoResults from '../../common/NoResults/NoResults';
import AddNew from '../../common/AddNew/AddNew';
import { SettingsContext } from '../../layout/SettingsProvider';
import { applyLighting } from '../../../lib/helper/lightingHelper';
import PlaylistControls from '../PlaylistControls/PlaylistControls';
import PlaylistButtons from '../PlaylistButtons/PlaylistButtons';
import './PlaylistDetail.scss';
import PaginatedList from '../../common/PaginatedList/PaginatedList';
import PlaylistTrackActions from '../PlaylistTrackActions/PlaylistTrackActions';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const PlaylistDetail = ({ name, handleBackToPlaylists }) => {
  const settings = useContext(SettingsContext);
  const [tracks, setTracks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const { isScreenSmall, screen } = settings;
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  const { controlButtonSize } = settings.styles;
  const trackHeight = controlButtonSize === 'small' ? 55 : 85;
  const [clickedTrack, setClickedTrack] = useState();
  const [clickedIndex, setClickedIndex] = useState();

  useEffect(() => {
    const itemHeight = isScreenSmall ? 40 : trackHeight;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  useEffect(() => {
    if (!showDeleteModal) {
      applyLighting(settings, 'Playlists');
    }
  }, [showDeleteModal]);

  const loadTracks = (playlistName) => {
    getPlaylist(playlistName).then((playlist) => {
      setSelectedPlaylist(playlist);

      if (!playlist.tracks.length) {
        setIsEmpty(true);
      } else {
        setTracks(playlist.tracks);
      }
    });
  };

  const handleSave = async (data) => {
    await add({
      name: data.name,
      tracks,
    });
    setIsSaveAsOpen(false);
    handleBackToPlaylists();
  };

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  const itemButtons = (track, index) => (
    <PlaylistButtons name={name} track={track} index={index} reloadTracks={loadTracks} />
  );

  const items = () => tracks.slice(realStart, (realStart + realPageSize)).map((track, index) => (
    {
      text: track.name,
      buttons: itemButtons(track, index),
      onItemClick: () => {
        setClickedTrack(track);
        setClickedIndex(index);
      },
    }
  ));

  const handleDelete = () => {
    deletePlaylist(name).then(() => {
      setShowDeleteModal(false);
      handleBackToPlaylists();
    });
  };

  const controls = (
    <PlaylistControls
      name={name}
      tracks={tracks}
      handleBackToPlaylists={handleBackToPlaylists}
      setIsSaveAsOpen={setIsSaveAsOpen}
      setShowDeleteModal={setShowDeleteModal}
      reloadTracks={loadTracks}
      isEmpty={isEmpty}
      showDeleteModal={showDeleteModal}
    />
  );

  const paginatorProps = {
    items: items(),
    selectedPage,
    setSelectedPage,
    pageSize: realPageSize,
    totalItems: tracks.length,
    hideButtons: screen.isMobile,
  }

  const content = () => {
    if (isEmpty) {
      return (
        <NoResults
          applyMargin={false}
          title={<FormattedMessage id="empty_playlist_title" />}
          text={<FormattedMessage id="empty_playlist_text" />}
        />
      );
    }

    return isSaveAsOpen ? (
      <AddNew
        fields={{ name: 'Name' }}
        onCancel={() => setIsSaveAsOpen(false)}
        onConfirm={data => handleSave(data)}
        confirmText='Add'
        cancelText='Cancel'
      />
    ) : (
      <PaginatedList {...paginatorProps} />
    );
  };

  const confirm = (
    <Confirm
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      text={<FormattedMessage id="delete_playlist_text" />}
    />
  );

  return (
    <>
      {screen.isMobile && clickedTrack && (
        <PlaylistTrackActions
          track={clickedTrack}
          onClose={() => {
            setClickedTrack(undefined);
            loadTracks(name);
          }}
          index={clickedIndex}
          playlistName={name}
        />
      )}
      {!showDeleteModal && !clickedTrack && (
        <>
          {!isScreenSmall && (
            <ContentWithControls
              controls={controls}
              content={content()}
            />
          )}
          {isScreenSmall && (
            <PaginatedList
              applyTopMargin
              topLevelControls={controls}
              {...paginatorProps}
            />
          )}
        </>
      )}
      {showDeleteModal && (
        <>
          {!isScreenSmall && (
            <ContentWithControls
              controls={controls}
              content={confirm}
            />
          )}
          {isScreenSmall && confirm}
        </>
      )}
    </>
  );
};

PlaylistDetail.propTypes = propTypes;

export default PlaylistDetail;
