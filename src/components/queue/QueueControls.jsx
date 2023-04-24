import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import ControlButton from '../common/ControlButton';
import { clearQueue, enqueueTracks } from '../../lib/queue-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { Tracks } from '../shapes';

const propTypes = {
  tracks: Tracks.isRequired,
  loadQueue: PropTypes.func.isRequired,
  setClearConfirm: PropTypes.func.isRequired,
  clearConfirm: PropTypes.bool,
};

const QueueControls = ({
  tracks, loadQueue, setClearConfirm, clearConfirm,
}) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const { controlButtonSize } = settings.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 60;
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
      <ControlButton {...buttonProps} onClick={() => setClearConfirm(true)} text={<FormattedMessage id="clear_queue" />} />
      <ControlButton {...buttonProps} onClick={() => shuffle()} text={<FormattedMessage id="shuffle_queue" />} />
      {settings.features.playlists && (
        <ControlButton
          {...buttonProps}
          onClick={() => navigate('/playlists', { state: { tracks } })}
          text={<FormattedMessage id="save_to_playlist" />}
        />
      )}
    </>
  );
};

QueueControls.propTypes = propTypes;

QueueControls.defaultProps = {
  clearConfirm: false,
};

export default QueueControls;
