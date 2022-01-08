import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import Item from './common/Item';
import styles from './styles';
import { Paging, Track } from './shapes';
import DownloadButton from './DownloadButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import PagedContainer from './common/PagedContainer';
import { SettingsContext } from './layout/SettingsProvider';

import './TrackList.css';
import AddToPlaylistButton from './common/AddToPlaylistButton';

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  paging: Paging.isRequired,
  previousPage: PropTypes.func.isRequired,
  setAddToPlaylist: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
};

function TrackList({
  nextPage,
  paging,
  previousPage,
  setAddToPlaylist,
  setAddTracks,
  tracks,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  let content = [];

  const trackCardStyle = {
    ...styles.cardStyle,
    color: settings.styles.fontColor,
    margin: '10px',
    width: '100%',
    background: settings.styles.trackBackgroundColor,
  };

  content = tracks.map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          <PlayNowButton
            track={track}
            isScreenSmall={isScreenSmall}
          />
          <EnqueueButton
            track={track}
            isScreenSmall={isScreenSmall}
          />
          <AddToPlaylistButton track={track} isScreenSmall={isScreenSmall} setAddToPlaylist={setAddToPlaylist} setAddTracks={setAddTracks} />
          <DownloadButton track={track} isScreenSmall={isScreenSmall} />
        </>
      )}
    />
  ));

  return (
    <PagedContainer
      paging={paging}
      content={content}
      clientNextPage={nextPage}
      clientPreviousPage={previousPage}
    />
  );
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
};

export default TrackList;
