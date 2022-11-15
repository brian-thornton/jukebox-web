import { ArrowLeft, CaretRightFill, ListOl, Shuffle, Save, XLg } from 'react-bootstrap-icons';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  deletePlaylist,
  add,
} from '../../lib/playlist-client';
import Button from '../Button';
import ControlButton from '../common/ControlButton';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const PlaylistControls = ({ name, tracks, handleBackToPlaylists, setIsSaveAsOpen, setShowDeleteModal, reloadTracks, showDeleteModal, isEmpty }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

  const runPlaylist = () => {
    enqueueTracksTop(tracks);
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
          <ControlButton style={{ fontSize }} height={buttonHeight} width="100%" disabled={showDeleteModal} onClick={handleBackToPlaylists} text="Go Back" />
          {settings.features.play && <ControlButton style={{ fontSize }}  height={buttonHeight} width="100%" disabled={showDeleteModal || isEmpty} onClick={runPlaylist} text="Run" />}
          {settings.features.queue && <ControlButton style={{ fontSize }}  height={buttonHeight} width="100%" disabled={showDeleteModal || isEmpty} onClick={enqueuePlaylist} text="Enqueue" />}
          <ControlButton style={{ fontSize }}  height={buttonHeight} width="100%" disabled={showDeleteModal || isEmpty} onClick={shuffle} text="Shuffle" />
          <ControlButton style={{ fontSize }}  height={buttonHeight} width="100%" disabled={showDeleteModal || isEmpty} onClick={() => setIsSaveAsOpen(true)} text="Save As..." />
          {settings.features.deletePlaylist && <ControlButton style={{ fontSize }}  height={buttonHeight} width="100%" disabled={showDeleteModal} onClick={() => setShowDeleteModal(true)} text="Delete" />}
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
