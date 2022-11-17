import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Container, Row, ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';

import Confirm from '../common/Confirm';
import Paginator from '../common/Paginator';
import {
  getPlaylist,
  deletePlaylist,
  add,
} from '../../lib/playlist-client';
import ContentWithControls from '../common/ContentWithControls';
import NoResults from '../common/NoResults';
import Item from '../common/Item';
import AddNew from '../common/AddNew';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';
import PlaylistControls from './PlaylistControls';
import PlaylistButtons from './PlaylistButtons';
import { handlers } from '../../lib/gesture-helper';
import './PlaylistDetail.scss';

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
  const [show, setShow] = useState(false);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let renderTracks = [];
  const isScreenSmall = window.innerWidth < 700;

  const { controlButtonSize } = settings.styles;
  const trackHeight = controlButtonSize === 'small' ? 50 : 80;

  useEffect(() => {
    const itemHeight = isScreenSmall ? 90 : trackHeight;
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
    })
    setIsSaveAsOpen(false);
    handleBackToPlaylists();
  };

  if (!isEmpty && !tracks.length) {
    loadTracks(name);
  }

  const buttons = (track, index) => (
    <PlaylistButtons name={name} track={track} index={index} reloadTracks={loadTracks} />
  );

  if (tracks) {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    renderTracks = tracks.slice(realStart, (realStart + realPageSize)).map((track, index) => (
      <Item text={track.name} buttons={buttons(track, index)} />
    ));
  }

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

  const playlistTracks = (
    <>
      <ListGroup {...swipe}>
        {renderTracks}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={tracks.length}
        pageSize={realPageSize}
      />
    </>
  );

  const content = () => {
    if (isEmpty) {
      return <NoResults applyMargin={false} title="Empty Playlist" text="This playlist contains no tracks. Please add tracks from the albums or tracks sections." />;
    }

    return (
      <>
        {isSaveAsOpen && (
          <AddNew
            fields={{ name: 'Name' }}
            onCancel={() => setIsSaveAsOpen(false)}
            onConfirm={(data) => handleSave(data)}
          />
        )}
        {!isSaveAsOpen && playlistTracks}
      </>
    );
  };

  const confirm = (
    <Confirm
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      title="Are you sure that you want to delete the playlist?"
    />
  );

  return (
    <>
      {!showDeleteModal && (
        <>
          {!isScreenSmall && (
            <ContentWithControls
              controls={controls}
              content={content()}
            />
          )}
          {isScreenSmall && (
            <Container className="playlist-detail-container">
              <Row>
                {controls}
              </Row>
              {playlistTracks}
            </Container>
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
}

PlaylistDetail.propTypes = propTypes;

export default PlaylistDetail;
