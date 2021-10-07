import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

import { downloadTrack } from '../lib/librarian-client';
import { Track } from './shapes';
import './DownloadButton.css';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  isScreenSmall: PropTypes.bool,
  track: Track.isRequired,
};

function DownloadButton({ track, isScreenSmall }) {
  const settings = useContext(SettingsContext);
  const handleDownload = () => {
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
    return <Button className="download" variant="link" onClick={() => handleDownload()}>Download</Button>;
  }

  return <React.Fragment />;
}

DownloadButton.defaultProps = {
  isScreenSmall: false,
};

DownloadButton.propTypes = propTypes;

export default DownloadButton;
