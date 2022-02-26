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

const propTypes = {
  tracks: PropTypes.arrayOf(TrackShape),
  showAlbumCovers: PropTypes.bool,
  setCurrentAlbum: PropTypes.func.isRequired,
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

  const getAlbums = async (pageTracks) => {
    setTrackAlbumsLoading(true);
    const data = await getTrackAlbums(pageTracks);
    setTrackAlbums(data);
    setTrackAlbumsLoaded(true);
    setTrackAlbumsLoading(false);
    return <></>;
  };

  if (!trackAlbumsLoaded && !trackAlbumsLoading) {
    getAlbums(tracks);
  }

  useEffect(() => {
    getAlbums(tracks);
  }, [tracks]);

  if (settings && settings.features) {
    tracks.forEach((track) => {
      if (track.path.split('.').pop().toLowerCase() === 'mp3') {
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
          const itemStyle = {
            ...styles.cardStyle,
            color: settings.styles.fontColor,
            background: settings.styles.trackBackgroundColor,
          };

          renderTracks.push(
            (
              <ListGroupItem style={itemStyle}>
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

  return <></>;
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  showAlbumCovers: false,
  tracks: [],
};

export default TrackList;
