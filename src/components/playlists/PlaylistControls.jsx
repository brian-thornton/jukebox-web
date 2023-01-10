import {
  ArrowLeft,
  CaretRightFill,
  ListOl,
  Shuffle,
  Save,
  XLg,
} from 'react-bootstrap-icons';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';

import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  deletePlaylist,
  add,
} from '../../lib/playlist-client';
import Button from '../Button';
import ControlButton from '../common/ControlButton';
import { SettingsContext } from '../layout/SettingsProvider';
import { Tracks } from '../shapes';

const propTypes = {
  handleBackToPlaylists: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool,
  name: PropTypes.string.isRequired,
  reloadTracks: PropTypes.func.isRequired,
  setIsSaveAsOpen: PropTypes.func.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.bool,
  tracks: Tracks.isRequired,
};

const PlaylistControls = ({
  intl,
  handleBackToPlaylists,
  isEmpty,
  name,
  reloadTracks,
  setIsSaveAsOpen,
  setShowDeleteModal,
  showDeleteModal,
  tracks,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
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

  const controlButton = (text, handler, flag = true) => {
    return (
      <>
        {flag && (
          <ControlButton
            style={{ fontSize }}
            height={buttonHeight}
            width="100%"
            disabled={showDeleteModal}
            onClick={handler}
            text={text}
          />
        )}
      </>
    )
  }

  return (
    <>
      {!isScreenSmall && (
        <>
          {controlButton(intl.formatMessage({ id: 'go_back' }), handleBackToPlaylists)}
          {controlButton(intl.formatMessage({ id: 'run' }), runPlaylist, features.play)}
          {controlButton(intl.formatMessage({ id: 'enqueue' }), enqueuePlaylist, features.queue)}
          {controlButton(intl.formatMessage({ id: 'shuffle' }), shuffle)}
          {controlButton(intl.formatMessage({ id: 'save_as' }), () => setIsSaveAsOpen(true))}
          {controlButton(intl.formatMessage({ id: 'delete' }), () => setShowDeleteModal(true), features.deletePlaylist)}
        </>
      )}
      {isScreenSmall && (
        <>
          <Button disabled={showDeleteModal} onClick={handleBackToPlaylists} icon={<ArrowLeft />} />
          {features.play && (
            <Button
              disabled={showDeleteModal || isEmpty}
              onClick={runPlaylist}
              icon={<CaretRightFill />}
            />
          )}
          {features.queue && (
            <Button
              disabled={showDeleteModal || isEmpty}
              onClick={enqueuePlaylist}
              icon={<ListOl />}
            />
          )}
          <Button disabled={showDeleteModal || isEmpty} onClick={shuffle} icon={<Shuffle />} />
          <Button
            disabled={showDeleteModal || isEmpty}
            onClick={() => setIsSaveAsOpen(true)}
            icon={<Save />}
          />
          <Button
            disabled={showDeleteModal}
            onClick={() => setShowDeleteModal(true)}
            icon={<XLg />}
          />
        </>
      )}
    </>
  );
};

PlaylistControls.defaultProps = {
  isEmpty: false,
  showDeleteModal: false,
};

PlaylistControls.propTypes = propTypes;

export default injectIntl(PlaylistControls);
