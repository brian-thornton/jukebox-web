import { FC, useContext } from 'react';
import { Download } from 'react-bootstrap-icons';

import Button from './Button/Button';
import { downloadTrack } from '../../../lib/service-clients/librarian-client';
import { ITrack } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IDownloadButton {
  track: ITrack,
}

const DownloadButton: FC<IDownloadButton> = ({ track }) => {
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

  if (settings?.features?.admin && settings.features.downloadTrack) {
    return <Button onClick={() => handleDownload()} content={<Download />} />;
  }

  return <></>;
};

export default DownloadButton;
