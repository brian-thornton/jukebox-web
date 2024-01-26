import { useNavigate } from 'react-router-dom';
import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import ControlButton from '../../common/Buttons/ControlButton/ControlButton';
import { clearQueue, enqueueTracks } from '../../../lib/service-clients/queue-client';
import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack } from '../../interface';

interface IQueueControls {
  tracks: Array<ITrack>
  loadQueue: Function,
  setClearConfirm: Function,
  clearConfirm: boolean,
}

const QueueControls: FC<IQueueControls> = ({
  tracks, loadQueue, setClearConfirm, clearConfirm,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const { controlButtonSize } = settings.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? undefined : '60';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';

  const shuffle = () => {
    clearQueue().then(() => {
      enqueueTracks(tracks.sort(() => Math.random() - 0.5)).then(() => {
        loadQueue();
      });
    });
  };

  const buttonProps = {
    width: '100%',
    disabled: tracks?.length === 0 || clearConfirm,
    height: buttonHeight,
    style: { fontSize },
  };

  return (
    <>
      <ControlButton {...buttonProps} onClick={() => setClearConfirm(true)} text={intl.formatMessage({id: "clear_queue"})} />
      <ControlButton {...buttonProps} onClick={() => shuffle()} text={intl.formatMessage({id: "shuffle_queue"})} />
      {settings?.features?.playlists && (
        <ControlButton
          {...buttonProps}
          onClick={() => navigate('/playlists', { state: { tracks } })}
          text={intl.formatMessage({id: "save_to_playlist"})}
        />
      )}
    </>
  );
};

export default QueueControls;
