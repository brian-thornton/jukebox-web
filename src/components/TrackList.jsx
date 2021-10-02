import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import {
  ListGroupItem, Container, Row,
} from 'react-bootstrap';
import styles from './styles';
import { getTrackAlbums } from '../lib/librarian-client';
import { Track as TrackShape } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';
import Track from './Track';

import './TrackList.css';

const propTypes = {
  tracks: PropTypes.arrayOf(TrackShape),
  showAlbumCovers: PropTypes.bool,
  setCurrentAlbum: PropTypes.func.isRequired,
  showDownloadLink: PropTypes.bool,
};

function TrackList({
  tracks,
  showAlbumCovers,
  setCurrentAlbum,
}) {
  const settings = useContext(SettingsContext);
  const [trackAlbumsLoading, setTrackAlbumsLoading] = useState();
  const [trackAlbumsLoaded, setTrackAlbumsLoaded] = useState(false);
  const [trackAlbums, setTrackAlbums] = useState([]);
  const isScreenSmall = window.innerWidth < 700;
  const renderTracks = [];

  const getAlbums = async (tracks) => {
    setTrackAlbumsLoading(true);
    const data = await getTrackAlbums(tracks);
    setTrackAlbums(data);
    setTrackAlbumsLoaded(true);
    setTrackAlbumsLoading(false);
    return <React.Fragment />;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getAlbums(tracks);
  }

  useEffect(() => {
    getAlbums(tracks);
  }, [tracks])

  if (settings && settings.features) {
    tracks.forEach((track) => {
      if (track.path.split('.').pop().toLowerCase() === 'mp3') {
        if (track.id) {
          track.accessToken = window.accessToken;
        }

        if (trackAlbumsLoaded && showAlbumCovers && !isScreenSmall) {
          renderTracks.push(
            (
              <Track
                track={track}
                trackAlbums={trackAlbums}
                trackAlbumsLoaded={trackAlbumsLoaded}
                showAlbumCovers={showAlbumCovers}
                setCurrentAlbum={setCurrentAlbum}
              />
            ),
          );
        } else {
          renderTracks.push(
            (
              <ListGroupItem style={{ ...styles.cardStyle, color: settings.styles.fontColor, background: settings.styles.trackBackgroundColor }}>
                {track.name}
                <br />
                <PlayNowButton track={track} isScreenSmall={isScreenSmall} />
                <EnqueueButton track={track} isScreenSmall={isScreenSmall} />
                <DownloadButton track={track} isScreenSmall={isScreenSmall} />
              </ListGroupItem>
            ),
          );
        }
      }
    });

    return <Container fluid style={{ marginTop: '15px', marginLeft: '0px' }}><Row>{renderTracks}</Row></Container>;
  }

  return <React.Fragment />;
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  showAlbumCovers: false,
  showDownloadLink: false,
  tracks: [],
};

export default TrackList;
