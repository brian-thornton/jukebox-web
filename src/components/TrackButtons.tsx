import { FC, useContext } from 'react';

import AddToPlaylistButton from './common/AddToPlaylistButton';
import { ITrack as TrackShape, IAlbum } from './interface';
import DownloadButton from './DownloadButton';
import GoToAlbumButton from './GoToAlbumButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';
import './Track.scss';

interface ITrackButtons {
  track: TrackShape,
  trackAlbums: Array<IAlbum>,
  trackAlbumsLoaded: boolean,
};

const TrackButtons: FC<ITrackButtons> = ({
  track,
  trackAlbums,
  trackAlbumsLoaded,
}) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;

  const getAlbum = (albumTrack: any) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === albumTrack.path.substr(0, albumTrack.path.lastIndexOf('/')));
    }

    return undefined;
  };

  return (
    <>
      {features?.albums && <GoToAlbumButton album={getAlbum(track)} />}
      {features?.playlists && <AddToPlaylistButton track={track} />}
      {features?.play && <PlayNowButton track={track} />}
      {features?.queue && <EnqueueButton track={track} mode="Tracks" />}
      {features?.downloadTrack && <DownloadButton track={track} />}
    </>
  );
};

export default TrackButtons;
