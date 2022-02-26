import { PropTypes } from 'prop-types';
import React from 'react';

import Item from '../common/Item';
import { Paging, Track } from '../shapes';
import DownloadButton from '../DownloadButton';
import PlayNowButton from '../PlayNowButton';
import EnqueueButton from '../EnqueueButton';
import PagedContainer from '../common/PagedContainer';

import AddToPlaylistButton from '../common/AddToPlaylistButton';

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
  const isScreenSmall = window.innerWidth < 700;
  let content = [];

  content = tracks.map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          <PlayNowButton track={track} />
          <EnqueueButton track={track} />
          <AddToPlaylistButton track={track} setAddToPlaylist={setAddToPlaylist} setAddTracks={setAddTracks} />
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
