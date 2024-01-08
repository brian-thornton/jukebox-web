import { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack } from '../../interface';
import AddToPlaylistButton from '../../common/AddToPlaylistButton/AddToPlaylistButton';
import DownloadButton from '../../DownloadButton';
import EnqueueButton from '../../EnqueueButton';
import PlayNowButton from '../../PlayNowButton';

interface IAlbumTrackButtons {
  track: ITrack,
}

const AlbumTrackButtons: FC<IAlbumTrackButtons> = ({ track }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;

  return (
    <>
      {features?.play && <PlayNowButton track={track} />}
      {features?.queue && <EnqueueButton isSelected={false} disabled={false} track={track} />}
      {features?.playlists && <AddToPlaylistButton track={track} />}
      {features?.downloadTrack && <DownloadButton track={track} />}
    </>
  );
};

export default AlbumTrackButtons;
