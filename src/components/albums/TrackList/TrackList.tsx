import { FC, useState, useContext } from 'react';

import { getTrackAlbums } from '../../../lib/service-clients/librarian-client';
import { ITrack } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';
import Track from '../Track/Track';
import TrackActions from '../TrackActions';
import styles from './TrackList.module.css';

interface ITrackList {
  tracks: Array<ITrack>,
  showAlbumCovers: boolean,
}

const TrackList: FC<ITrackList> = ({
  tracks,
  showAlbumCovers,
}) => {
  const settings = useContext(SettingsContext);
  const [isTrackClicked, setIsTrackClicked] = useState<ITrack | undefined>(undefined);
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState(false);
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);

  const getTrackCoverArt = async (pageTracks: any) => {
    setTrackAlbumsLoading(true);
    const data = await getTrackAlbums(pageTracks);
    setTrackAlbums(data);
    setTrackAlbumsLoaded(true);
    setTrackAlbumsLoading(false);
    return <></>;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getTrackCoverArt(tracks);
  }

  return (
    <>
      {settings?.features && trackAlbumsLoaded && !isTrackClicked && (
        <div className={styles.trackListContainer}>
          {tracks.map(track => (
            <Track
              track={track}
              trackAlbums={trackAlbums}
              trackAlbumsLoaded={trackAlbumsLoaded}
              showAlbumCovers={showAlbumCovers}
              setTrackClicked={setIsTrackClicked}
            />
          ))}
        </div>
      )}
      {settings.isScreenSmall && settings?.features && trackAlbumsLoaded && isTrackClicked && <TrackActions track={isTrackClicked} onClose={() => setIsTrackClicked(undefined)} />}
    </>
  );
};

export default TrackList;
