import Container from 'react-bootstrap/Container';
import { FC, useState, useContext } from 'react';

import { getTrackAlbums } from '../lib/librarian-client';
import { ITrack } from './interface';
import { SettingsContext } from './layout/SettingsProvider';
import Track from './Track';
import './TrackList.scss';

interface ITrackList {
  tracks: Array<ITrack>,
  showAlbumCovers: boolean,
};

const TrackList: FC<ITrackList> = ({
  tracks,
  showAlbumCovers,
}) => {
  const settings = useContext(SettingsContext);
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
      {settings?.features && trackAlbumsLoaded && (
        <Container fluid className="trackListContainer">
          {tracks.map(track => (
            <Track
              track={track}
              trackAlbums={trackAlbums}
              trackAlbumsLoaded={trackAlbumsLoaded}
              showAlbumCovers={showAlbumCovers}
            />
          ))}
        </Container>
      )}
    </>
  );
};

export default TrackList;
