import React, { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import LibrianClient from '../lib/librarian-client';
import { Track, Settings } from './shapes';
import './DownloadButton.css';

const propTypes = {
  settings: Settings.isRequired,
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function DownloadButton({ track, settings, isScreenSmall }) {
  const handleDownload = (track) => {
    LibrianClient.downloadTrack(track).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = track.name;
        a.click();
      });
    });
  };

  if (settings && settings.features.admin && settings.features.downloadTrack && !isScreenSmall) {
    return <div className="download"><a onClick={() => handleDownload(track)}>Download</a></div>;
  }

  return <React.Fragment />;
};

DownloadButton.propTypes = propTypes;

export default DownloadButton;