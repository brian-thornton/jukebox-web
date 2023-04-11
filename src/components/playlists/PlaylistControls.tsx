import {
  ArrowLeft,
  CaretRightFill,
  ListOl,
  Shuffle,
  Save,
  XLg,
} from 'react-bootstrap-icons';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { enqueueTracks, enqueueTracksTop, play } from '../../lib/queue-client';
import {
  deletePlaylist,
  add,
} from '../../lib/playlist-client';
import Button from '../Button';
import ControlButton from '../common/ControlButton';
import { SettingsContext } from '../layout/SettingsProvider';
import { ITrack } from '../interface';

interface IPlaylistControls {
  handleBackToPlaylists: Function,
  isEmpty: boolean,
  name: string,
  reloadTracks: Function,
  setIsSaveAsOpen: Function,
  setShowDeleteModal: Function,
  showDeleteModal: boolean,
  tracks: [ITrack],
};

const PlaylistControls: FC<IPlaylistControls> = ({
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
  const buttonHeight = (!settings?.styles?.controlButtonSize || settings?.styles?.controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!settings?.styles?.controlButtonSize || settings?.styles?.controlButtonSize === 'small') ? '' : '25px';

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

  const controlButton = (text: any, handler: any, flag = true) => (
    <>
      {flag && (
        <ControlButton
          style={{fontSize}}
          height={buttonHeight}
          width="100%"
          disabled={showDeleteModal}
          onClick={handler}
          text={text}
          isSelected={false}
        />
      )}
    </>
  );

  return (
    <>
      {!isScreenSmall && (
        <>
          {controlButton(<FormattedMessage id="go_back" />, handleBackToPlaylists)}
          {controlButton(<FormattedMessage id="run" />, runPlaylist, features?.play)}
          {controlButton(<FormattedMessage id="enqueue" />, enqueuePlaylist, features?.queue)}
          {controlButton(<FormattedMessage id="shuffle" />, shuffle)}
          {controlButton(<FormattedMessage id="save_as" />, () => setIsSaveAsOpen(true))}
          {controlButton(<FormattedMessage id="delete" />, () => setShowDeleteModal(true), features?.deletePlaylist)}
        </>
      )}
      {isScreenSmall && (
        <>
          <Button disabled={showDeleteModal} onClick={handleBackToPlaylists} icon={<ArrowLeft />} />
          {features?.play && (
            <Button
              disabled={showDeleteModal || isEmpty}
              onClick={runPlaylist}
              icon={<CaretRightFill />}
            />
          )}
          {features?.queue && (
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

export default PlaylistControls;
