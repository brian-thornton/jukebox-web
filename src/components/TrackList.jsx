import { PropTypes } from 'prop-types';
import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';

import styles from './styles';
import { getTrackAlbums } from '../lib/librarian-client';
import { Track as TrackShape } from './shapes';
import { SettingsContext } from './layout/SettingsProvider';
import Track from './Track';

const propTypes = {
  tracks: PropTypes.arrayOf(TrackShape),
  showAlbumCovers: PropTypes.bool,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function TrackList({
  tracks,
  showAlbumCovers,
  setCurrentAlbum,
  setAddTracks,
}) {
  const settings = useContext(SettingsContext);
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState();
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);
  const isMp3 = (track) => track.path.split('.').pop().toLowerCase() === 'mp3';

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

  if (settings && settings.features) {
    return (
      <>
        {trackAlbumsLoaded && (
          <Container style={{ width: '100%', marginTop: '15px', marginLeft: '0px' }}>
            {tracks.map((track) => {
              if (isMp3(track)) {
                return (
                  <Track
                    track={track}
                    trackAlbums={trackAlbums}
                    trackAlbumsLoaded={trackAlbumsLoaded}
                    showAlbumCovers={showAlbumCovers}
                    setCurrentAlbum={setCurrentAlbum}
                    setAddTracks={setAddTracks}
                  />
                )
              }
            })}
          </Container>
        )}
      </>
    )
  }

  return <></>;
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  showAlbumCovers: false,
  tracks: [],
};

export default TrackList;
