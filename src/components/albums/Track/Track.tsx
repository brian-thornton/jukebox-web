import { FC, useContext, useState } from 'react';

import TrackAlbum from '../TrackAlbum/TrackAlbum';
import { ITrack as TrackShape, IAlbum } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';
import Item from '../../common/Item/Item';
import styles from './Track.module.css';
import TrackButtons from '../TrackButtons/TrackButtons';

interface ITrack {
  showAlbumCovers: boolean,
  track: TrackShape,
  trackAlbums: Array<IAlbum>,
  trackAlbumsLoaded: boolean,
  setTrackClicked?: Function,
}

const Track: FC<ITrack> = ({
  showAlbumCovers,
  track,
  trackAlbums,
  trackAlbumsLoaded,
  setTrackClicked,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const [clicked, setClicked] = useState(false);

  const getAlbum = (albumTrack: any) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === albumTrack.path.substr(0, albumTrack.path.lastIndexOf('/')));
    }

    return undefined;
  };

  const album = (albumTrack: any) => {
    const ta = getAlbum(albumTrack);

    if (showAlbumCovers && ta) {
      if (settings && features) {
        return (
          <TrackAlbum
            // @ts-ignore
            album={ta}
          />
        );
      }
    }

    return <></>;
  };

  // TODO: Make this work with \
  const pathParts = track.path.split('/');
  const albumFolder = pathParts[pathParts.length - 2];

  if (isScreenSmall) {
    return (
      <>
        {<Item
          text={`${albumFolder} - ${track.name}`} onClick={() => {
            if (settings?.isScreenSmall && setTrackClicked) {
              setTrackClicked(track);
            }
          }} />}
      </>
    );
  }

  return (
    <>
      {!clicked && (
        <div className={styles.trackRow}>
          <div className={styles.coverAndName}>
            <div className={styles.albumCover}>
              {album(track)}
            </div>
            <div className={styles.trackName}>
              {`${albumFolder} - ${track.name}`}
            </div>
          </div>
          <TrackButtons track={track} trackAlbums={trackAlbums} trackAlbumsLoaded={trackAlbumsLoaded} />
        </div>
      )}
    </>
  );
};

export default Track;
