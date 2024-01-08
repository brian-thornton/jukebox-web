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
import { useNavigate } from 'react-router-dom';

import { runPlaylist, enqueuePlaylist, shuffle } from '../../../lib/helper/playlist-helper';
import Button from '../../common/Button/Button';
import ControlButton from '../../common/ControlButton/ControlButton';
import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack } from '../../interface';

interface IPlaylistControls {
  isEmpty: boolean,
  name: string,
  reloadTracks: Function,
  setIsSaveAsOpen: Function,
  setShowDeleteModal: Function,
  showDeleteModal: boolean,
  tracks: [ITrack],
}

const PlaylistControls: FC<IPlaylistControls> = ({
  isEmpty,
  name,
  reloadTracks,
  setIsSaveAsOpen,
  setShowDeleteModal,
  showDeleteModal,
  tracks,
}) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const { features, isScreenSmall } = settings;
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';

  const controlButton = (text: any, handler: any, flag = true) => (
    <>
      {flag && (
        <ControlButton
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
          {controlButton(<FormattedMessage id="go_back" />, () => navigate('/playlists'))}
          {controlButton(<FormattedMessage id="run" />, () => runPlaylist(tracks), features?.play)}
          {controlButton(<FormattedMessage id="enqueue" />, () => enqueuePlaylist(tracks), features?.queue)}
          {controlButton(<FormattedMessage id="shuffle" />, () => shuffle(name, tracks, reloadTracks))}
          {controlButton(<FormattedMessage id="save_as" />, () => setIsSaveAsOpen(true))}
          {controlButton(<FormattedMessage id="delete" />, () => setShowDeleteModal(true), features?.deletePlaylist)}
        </>
      )}
      {isScreenSmall && (
        <>
          <Button disabled={showDeleteModal} onClick={() => navigate('/playlists')} icon={<ArrowLeft />} />
          {features?.play && (
            <Button
              disabled={showDeleteModal || isEmpty}
              onClick={() => runPlaylist(tracks)}
              icon={<CaretRightFill />}
            />
          )}
          {features?.queue && (
            <Button
              disabled={showDeleteModal || isEmpty}
              onClick={() => enqueuePlaylist(tracks)}
              icon={<ListOl />}
            />
          )}
          <Button disabled={showDeleteModal || isEmpty} onClick={() => shuffle(name, tracks, reloadTracks)} icon={<Shuffle />} />
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
