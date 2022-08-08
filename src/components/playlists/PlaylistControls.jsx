import { ArrowLeft, CaretRightFill, ListOl, Shuffle, Save, XLg } from 'react-bootstrap-icons';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';

import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  deletePlaylist,
  add,
} from '../../lib/playlist-client';
import Button from '../Button';
import ControlButton from '../common/ControlButton';
import { toastProps } from '../common/toast-helper';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const PlaylistControls = ({ name, tracks, handleBackToPlaylists, setIsSaveAsOpen, setShowDeleteModal, reloadTracks, showDeleteModal, isEmpty }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const runPlaylist = () => {
    enqueueTracksTop(tracks).then(() => toast.success("Playlist added to queue!", toastProps));
    play();
  };

  const enqueuePlaylist = () => {
    enqueueTracks(tracks);
  };

  const shuffle = () => {
    deletePlaylist(name).then(() => {
      const newOrder = tracks.sort(() => Math.random() - 0.5);

      add({
        name,
        tracks: newOrder,
      }).then(() => reloadTracks(name));
    });
  };

  return (
    <>
      {!isScreenSmall && (
        <>
          <ControlButton disabled={showDeleteModal} onClick={handleBackToPlaylists} text="Back to Playlists" />
          {settings.features.play && <ControlButton disabled={showDeleteModal || isEmpty} onClick={runPlaylist} text="Run Playlist" />}
          {settings.features.queue && <ControlButton disabled={showDeleteModal || isEmpty} onClick={enqueuePlaylist} text="Enqueue Playlist" />}
          <ControlButton disabled={showDeleteModal || isEmpty} onClick={shuffle} text="Shuffle Playlist" />
          <ControlButton disabled={showDeleteModal || isEmpty} onClick={() => setIsSaveAsOpen(true)} text="Save As..." />
          {settings.features.deletePlaylist && <ControlButton disabled={showDeleteModal} onClick={() => setShowDeleteModal(true)} text="Delete Playlist" />}
        </>
      )}
      {isScreenSmall && (
        <>
          <Button disabled={showDeleteModal} onClick={handleBackToPlaylists} icon={<ArrowLeft />} />
          {settings.features.play && <Button disabled={showDeleteModal || isEmpty} onClick={runPlaylist} icon={<CaretRightFill />} />}
          {settings.features.queue && <Button disabled={showDeleteModal || isEmpty} onClick={enqueuePlaylist} icon={<ListOl />} />}
          <Button disabled={showDeleteModal || isEmpty} onClick={shuffle} icon={<Shuffle />} />
          <Button disabled={showDeleteModal || isEmpty} onClick={() => setIsSaveAsOpen(true)} icon={<Save />} />
          <Button disabled={showDeleteModal} onClick={() => setShowDeleteModal(true)} icon={<XLg />} />
        </>
      )}
    </>
  );
}

PlaylistControls.propTypes = propTypes;

export default PlaylistControls;
