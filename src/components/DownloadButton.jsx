import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

import { downloadTrack } from '../lib/librarian-client';
import { Track } from './shapes';
import './DownloadButton.css';
import { SettingsContext } from './layout/Jukebox';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function DownloadButton({ track, isScreenSmall }) {
  const settings = useContext(SettingsContext);
  const handleDownload = (track) => {
    downloadTrack(track).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = track.name;
        a.click();
      });
    });
  };

  if (settings.features.admin && settings.features.downloadTrack && !isScreenSmall) {
    return <div className="download"><a onClick={() => handleDownload(track)}>Download</a></div>;
  }

  return <React.Fragment />;
}

DownloadButton.propTypes = propTypes;

export default DownloadButton;
