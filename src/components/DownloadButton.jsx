import React, { useContext } from 'react';
import { Download } from 'react-bootstrap-icons';

import Button from './Button';
import { downloadTrack } from '../lib/librarian-client';
import { Track } from './shapes';
import './DownloadButton.css';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  track: Track.isRequired,
};

const DownloadButton = ({ track }) => {
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

  if (settings.features.admin && settings.features.downloadTrack) {
    return <Button onClick={() => handleDownload()} content={<Download />} />
  }

  return <></>;
}

DownloadButton.propTypes = propTypes;

export default DownloadButton;
