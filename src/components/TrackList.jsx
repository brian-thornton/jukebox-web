import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useState, useContext } from 'react';

import { getTrackAlbums } from '../lib/librarian-client';
import { Track as TrackShape } from './shapes';
import { SettingsContext } from './layout/SettingsProvider';
import Track from './Track';
import './TrackList.scss';

const propTypes = {
  tracks: PropTypes.arrayOf(TrackShape),
  showAlbumCovers: PropTypes.bool,
  setAddTracks: PropTypes.func,
};

const TrackList = ({
  tracks,
  showAlbumCovers,
  setAddTracks,
}) => {
  const settings = useContext(SettingsContext);
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState();
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);

  const getTrackCoverArt = async (pageTracks) => {
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

  if (settings?.features) {
    return (
      <>
        {trackAlbumsLoaded && (
          <Container fluid className="trackListContainer">
            {tracks.map((track) => {
              return (
                <Track
                  track={track}
                  trackAlbums={trackAlbums}
                  trackAlbumsLoaded={trackAlbumsLoaded}
                  showAlbumCovers={showAlbumCovers}
                  setAddTracks={setAddTracks}
                />
              );
            })}
          </Container>
        )}
      </>
    );
  }

  return <></>;
};

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  showAlbumCovers: false,
  tracks: [],
  setAddTracks: null,
};

export default TrackList;
